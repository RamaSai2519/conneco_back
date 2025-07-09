from shared.uniservices.after_request import Handler
from shared.configs import CONFIG as config
from flask_jwt_extended import JWTManager
from flask import Flask, Response
from services.controller import *
from flask_restful import Api
from flask_cors import CORS
import awsgi
import sys
import os


app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = config.JWT_ACCESS_TOKEN_EXPIRES
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = config.JWT_REFRESH_TOKEN_EXPIRES

api = Api(app)
JWTManager(app)
CORS(app, supports_credentials=True)


# Auth Routes
api.add_resource(AuthLoginService, '/con/login')
api.add_resource(AuthSignupService, '/con/signup')
api.add_resource(AuthRefreshService, '/con/refresh')

# Posts Routes
api.add_resource(PostCreateService, '/con/create')
api.add_resource(PostUserPostsService, '/con/user')
api.add_resource(PostSearchService, '/con/search')


@app.after_request
def handle_after_request(response: Response) -> Response:
    return Handler(response).handle_after_request()


def handler(event, context) -> dict:
    print(event)
    return awsgi.response(app, event, context)


if __name__ == '__main__':
    app.run(port=8080, debug=True)
