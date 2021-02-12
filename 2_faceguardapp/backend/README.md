# FaceGuard Backend

## Introduction
This is the Backend for FaceGuard. It is important to mention that this is just a MVP. 
Therefore, on every restart, the database of trained faces will be resetted. 

## Requirements
We are using Spotify's annoy package (https://github.com/spotify/annoy). 
This package is not available for every environment. Please note, that you must have g++ installed in your environment.

## Getting Started
1. Clone this repository to your local machine (or any other server you would like to run it on)
2. Install all required packages (provided in requirements.txt)
```
pip install -r requirements.txt
```
3. Adjust the configuration for
- A GCloud Bucket must be configured in credentials/gcloud.json (For more information refer to the Google API Docs, e.g. https://googleapis.dev/python/google-api-core/latest/auth.html)
- A Mongo DB must be configured in credentials/mongodb.json (No default entries needed, a blank database is sufficient)
4. Run the Backend
```
python main.py
```
5. Consume the Backend either directly with the API documented below or using our Frontend. It will be available on Port 8080 after starting.
## Methods: 

###[GET] api/v1/user 
List of all user in the database

###[GET] api/v1/user/:id
Gets the user information for a specific user

###[POST] api/v1/login
Takes an email and password as body and returns the user object if successful or an error.

Example Request Body:
```json
{
    "email": "max@mustermann.de",
    "password": "test"
}
```


###[POST] api/v1/train 
Add a new image  

Requires a file uploaded as well as an userid (which gets returned by the login method)

###[POST] api/v1/prediction 
Run prediction on an image, returns true or false 

Requires a file uploaded as well as an userid (which gets returned by the login method)

###[GET] api/v1/health 
Server Healthcheck for deployment

