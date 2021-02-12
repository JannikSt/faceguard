import os

from flask import (Flask, abort, jsonify, make_response, request,
                   send_from_directory)
from flask_cors import CORS
from google.cloud import storage
from PIL import Image
import bcrypt
from werkzeug.utils import secure_filename
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from db.database import Database
from pipeline.embeddingmodel import EmbeddingModel
from pipeline.facedetection import FaceDetection
from pipeline.predictionsvm import PredictionSVM
from pipeline.annoyimpl import Annoy
from flask import send_file
import tempfile
import json


UPLOAD_DIRECTORY = "api_uploaded_files"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)


with open('credentials/mongodb.json', 'r') as mongoconfig:
    data=mongoconfig.read()
obj = json.loads(data)

os.environ["MONGO_URI"] = str(obj['uri'])
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "credentials/gcloud.json"
app = Flask(__name__)
app.config["MONGO_URI"] = os.environ["MONGO_URI"]
CORS(app)
mongo = PyMongo(app)

# GCloud File Upload
bucket_name = "tumfaceguard"
storage_client = storage.Client()
bucket = storage_client.bucket(bucket_name)

# Imports
embedding_model = EmbeddingModel()
prediction_model = PredictionSVM()  
facedetection_model = FaceDetection()
annoy = Annoy(512, 'testmodel')
annoy.train([], 10)

db = Database()
indexToUser = Database()

# add some default data
#db.load_from_file('db/db_embedding')
#indexToUser.load_from_file('db/db_user')



currentIndex = 0


def serialize_file(file):
    file['_id'] = str(file['_id'])
    file['user'] = str(file['user'])
    return file

def serialize_user(user):
    user['_id'] = str(user['_id'])
    user['firstname'] = str(user['firstname'])
    user['lastname'] = str(user['lastname'])
    user['email'] = str(user['email'])
    del user['password']
    return user

@app.route("/api/v1/train", methods=["POST"])
def train():
    """Upload a file."""
    if 'file' not in request.files:
        return make_response(jsonify({"status": "error", "error": "No file attached!"}), 400)

    file = request.files['file']
    userid = request.form.get('userid')

    print("name: ", userid)
    if userid == None:
        return make_response(jsonify({"status": "error", "error": "Missing userid!"}), 400)

    if file.filename == '':
        return make_response(jsonify({"status": "error", "error": "Missing filename!"}), 400)

    # Check filetype
    if file.filename.lower().endswith(('.jpg', '.jpeg')):
        if file:
            filename = secure_filename(file.filename)
            print("Filename", filename)
            try:
                fileid = announce_user_file(userid, filename)
                user = get_user(userid)
                if not user:
                    return make_response(jsonify({"status": "error", "response": "user not found"}), 500)
                b = bucket.blob(fileid)
                b.upload_from_file(file)

                image = Image.open(file)  
                cropped_face = facedetection_model.cropface(image)  
                embedding = embedding_model.generateEmbedding(cropped_face)

                global currentIndex
                currentIndex += 1
                db.add_to_db(currentIndex, embedding)
                indexToUser.add_to_db(currentIndex, userid)

                trainitems = []
                for face in db.database:
                    for face_encode in db.database[face]:
                        trainitems.append((face, face_encode))
                annoy.train(trainitems, 10)

                return make_response(jsonify({"status": "ok"}), 201)
            except Exception as e:
                print(str(e))
                return make_response(jsonify({"status": "error"}), 500)
    else:
        return make_response(jsonify({"status": "error", "error": "Not a valid filetype"}), 400)

@app.route("/api/v1/predict", methods=["POST"])
def predict():
    """Upload a file."""
    if 'file' not in request.files:
        return make_response(jsonify({"status": "error", "error": "No file attached!"}), 400)

    file = request.files['file']
    userid = request.form.get('userid')

    if file.filename == '':
        return make_response(jsonify({"status": "error", "error": "Missing filename!"}), 400)

    # Check filetype
    if file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')):
        if file:
            filename = secure_filename(file.filename)
            print("Filename", filename)
            try:
                b = bucket.blob(filename)
                b.upload_from_file(file)

                image = Image.open(file)  
                cropped_face = facedetection_model.cropface(image)  
                embedding = embedding_model.generateEmbedding(cropped_face)

                if len(db) < 1:
                    return make_response(jsonify({"status": "error", "error":"More than 1 entires in the database are needed!"}), 400)
                else:
                    v = embedding.detach().numpy().squeeze()
                    prediction = annoy.model.get_nns_by_vector(v, 1, search_k=-1, include_distances=True)

                    res_intid = prediction[0][0]
                    res_pred = prediction[1][0]

                    ret_user = get_user(userid)

                    label = ""
                    isMatching = False
                    confidence = 0
                    user = []
                    if indexToUser.exists(res_intid) and res_pred < 1.1:
                        try:
                            returned_user_id = indexToUser.database[res_intid][0]
                            if returned_user_id == userid:
                                isMatching = True
                                user = ret_user
                        except:
                            print('error')

                    confidence = res_pred

                    return make_response(jsonify({"status": "ok", "data": {"name": label, "confidence": confidence, "user": user}, "isMatching": isMatching}), 200)
            except Exception as e:
                print(str(e))
                return make_response(jsonify({"status": "error", "error":str(e)}), 500)
    else:
        return make_response(jsonify({"status": "error", "error": "Not a valid filetype"}), 400)

@app.route("/api/v1/persons", methods=["GET"])
def list_persons():
    return make_response(jsonify({"status": "ok", "data": list(db.database.keys())}), 200)

@app.route("/api/v1/persons", methods=["DELETE"])
def delete_persons():
    db.clear_database()
    return make_response(jsonify({"status": "ok"}), 200)

@app.route("/api/v1/health", methods=["GET"])
def healthcheck():
    return make_response(jsonify({"status": "ok"}), 200)

@app.route("/api/v1/backup/load", methods=["POST"])
def loadbackup():
    # TODO: Download from Gcloud
    b = bucket.blob('db.pkl')
    b.download_to_filename('db.pkl')
    db.load_from_file('db')
    return make_response(jsonify({"status": "ok"}), 200)


@app.route("/api/v1/file/<fileid>", methods=["GET"])
def get_user_file(fileid):
    file = mongo.db.user_file.find_one({"_id": ObjectId(fileid)})
    print(fileid)
    if file:
        blob = bucket.get_blob(fileid)
        with tempfile.NamedTemporaryFile() as temp:
            blob.download_to_filename(temp.name)
            return send_file(temp.name,
                             attachment_filename=file['filename'],
                         mimetype='image/jpeg')
    else:
        return {"status": "error", "response": "file not found"}


def get_user_intid(internal_id):
    print("Finding user int ", internal_id)
    cursor = mongo.db.user.find({"internal_id": internal_id})
    data = []
    for user in cursor:
        data = serialize_user(user)
    return data

def get_user(userid):
    print("Finding user ", userid)
    cursor = mongo.db.user.find({"_id": ObjectId(userid)})
    data = []
    for user in cursor:
        data = serialize_user(user)
    return data


@app.route("/api/v1/user_file/<userid>", methods=["GET"])
def list_user_file(userid):
    cursor = mongo.db.user_file.find({"user": userid})
    data = []
    for user in cursor:
        data.append(serialize_file(user))
    return jsonify({"data": data})


@app.route("/api/v1/user", methods=["GET"])
def list_user():
    cursor = mongo.db.user.find()
    data = []
    for user in cursor:
        data.append(serialize_user(user))

    return jsonify({"data": data})

def announce_user_file(user, filename):
    insert = mongo.db.user_file.insert({"user": user, "filename": filename})
    return str(insert)

@app.route("/api/v1/user", methods=["POST"])
def insert_user():
    data = request.get_json()
    if not data:
        return {"status": "error", "response": "invalid request"}
    else:
        email = data.get('email')
        password = data.get('password')
        if email and password:
            if mongo.db.user.find_one({"email": email}):
                return {"status": "error", "response": "user email already exists."}
            else:
                highest = mongo.db.user.find_one(sort=[("internal_id", -1)])
                newId = 0
                if highest:
                    newId = int(highest["internal_id"]) + 1
                salt = bcrypt.gensalt()
                hashed = bcrypt.hashpw(password.encode(), salt)
                data['password'] = hashed.decode()
                data['internal_id'] = newId
                inserted = mongo.db.user.insert(data)
                return {"status": "ok", "response": "user inserted.", "id": str(inserted)}
        else:
            return {"status": "error", "response": "email or password missing"}

@app.route("/api/v1/user", methods=["PUT"])
def update_user():
    data = request.get_json()
    if not data:
        return {"status": "error", "response": "invalid request"}
    else:
        email = data.get('email')
        password = data.get('password')
        if email:
            user = mongo.db.user.find_one({"email": email});
            if user:
                if password:
                    salt = bcrypt.gensalt()
                    hashed = bcrypt.hashpw(password.encode(), salt)
                    data['password'] = hashed.decode()
                else:
                    data['password'] = user['password']
                mongo.db.user.update({'email': email}, {'$set': data})
                return {"status": "ok", "response": "user updated."}
            else:
                return {"status": "error", "response": "user does not exist."}
        else:
            return {"status": "error", "response": "email or password missing"}


@app.route("/api/v1/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return {"status": "error", "response": "invalid request"}
    else:
        email = data.get('email')
        password = data.get('password')
        if email and password:
            login = mongo.db.user.find_one({"email": email})
            if login:
                if bcrypt.checkpw(password.encode(), login['password'].encode()):
                    return {"status": "ok", "response": "user ok.", "data": serialize_user(login)}
                else:
                    return {"status": "error", "response": "password not ok."}
            else:
                return {"status": "error", "response": "user does not exist."}
        else:
            return {"status": "error", "response": "email or password missing"}

@app.route("/api/v1/backup/store", methods=["POST"])
def storebackup():
    db.to_file('db')
    b = bucket.blob('db.pkl')
    b.upload_from_filename('db.pkl')
    return make_response(jsonify({"status": "ok"}), 200)

@app.route("/api/v1/store", methods=["POST"])
def store_db():
    db.to_file('db_embedding')
    indexToUser.to_file('db_user')

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=8080)


