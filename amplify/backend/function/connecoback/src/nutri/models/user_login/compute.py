from typing import Union
from passlib.hash import pbkdf2_sha256
from shared.models.common import Common
from nutri.db.users import get_user_collection
from shared.models.constants import OutputStatus
from nutri.models.interfaces import LoginInput as Input, Output
from flask_jwt_extended import create_access_token, create_refresh_token


class Compute:
    def __init__(self, input: Input) -> None:
        self.input = input
        self.query = self.decide_query()
        self.users_collection = get_user_collection()

    def decide_query(self) -> dict:
        query = {}
        if self.input.phone:
            query['phone'] = self.input.phone
        elif self.input.email:
            query['email'] = self.input.email
        return query

    def validate_user(self) -> Union[dict, None]:
        user = self.users_collection.find_one(self.query)
        return user if user else None

    def compute(self) -> Output:
        user = self.validate_user()
        if not user:
            return Output(
                msg="User not found",
                status=OutputStatus.FAILURE
            )

        if not pbkdf2_sha256.verify(self.input.password, user['password']):
            return Output(
                msg="Invalid credentials",
                status=OutputStatus.FAILURE
            )

        user_data = Common.jsonify(user)
        access_token = create_access_token(identity=user['_id'])
        refresh_token = create_refresh_token(identity=user['_id'])

        user_data['tokens'] = {
            'access': access_token,
            'refresh': refresh_token
        }

        return Output(
            msg="Login successful",
            data=Common.jsonify(user_data)
        )
