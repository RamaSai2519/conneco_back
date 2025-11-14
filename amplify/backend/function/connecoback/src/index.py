
from shared.uniservices.after_request import Handler
from shared.configs import CONFIG as config
from flask_jwt_extended import JWTManager
from nutri.services.controller import *
from flask import Flask, Response
from services.controller import *
from flask_restful import Api
from flask_cors import CORS
import awsgi


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
api.add_resource(PostUserPostsService, '/con/posts')
api.add_resource(UploadService, '/con/upload')

# Schools Routes
api.add_resource(SchoolsService, '/con/schools')

# Nutri Routes
api.add_resource(Meals, '/con/nmeals')
api.add_resource(UserService, '/con/nuser')
api.add_resource(UserLoginService, '/con/nlogin')


@app.after_request
def handle_after_request(response: Response) -> Response:
    return Handler(response).handle_after_request()


def handler(event, context) -> dict:
    print(event)
    return awsgi.response(app, event, context)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
