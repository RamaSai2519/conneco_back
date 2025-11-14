import json
import dataclasses
from flask import request
from flask_restful import Resource
from nutri.models.user_login.main import UserLogin
from nutri.models.upsert_user.main import UpsertUser
from nutri.models.interfaces import User, LoginInput


class UserService(Resource):

    def post(self) -> dict:
        input = json.loads(request.get_data())
        input = User(**input)
        output = UpsertUser(input).process()
        output = dataclasses.asdict(output)

        return output


class UserLoginService(Resource):

    def post(self) -> dict:
        print( "Login request received" )
        input = json.loads(request.get_data())
        input = LoginInput(**input)
        output = UserLogin(input).process()
        output = dataclasses.asdict(output)

        return output
