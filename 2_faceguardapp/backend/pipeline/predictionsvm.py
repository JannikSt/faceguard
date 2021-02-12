from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import Normalizer
import numpy as np

class PredictionSVM:
    X = []
    Y = []
    Y_encoded = []

    label_encoder = LabelEncoder()
    in_encoder = Normalizer(norm='l2')

    model = SVC(kernel='linear', probability=True)

    def __init__(self):
        pass

    def train(self, database):
        for face in database:
            for face_encode in database[face]:
                self.X.append(self.in_encoder.transform(face_encode.detach().numpy()).flatten())
                self.Y.append(face)

        self.label_encoder.fit(self.Y)
        self.Y_encoded = self.label_encoder.transform(self.Y)

        self.model.fit(self.X, self.Y_encoded)
        print("Model Trained")

    def predict(self, embedding):
        embedding_numpy = embedding.detach().numpy()
        faceclass = self.model.predict(embedding_numpy)
        faceprobability = self.model.predict_proba(embedding_numpy)

        class_index = faceclass[0]
        print(faceclass)
        class_label = self.label_encoder.inverse_transform(faceclass)[0]

        # TODO: Setup probabilities

        return class_label
