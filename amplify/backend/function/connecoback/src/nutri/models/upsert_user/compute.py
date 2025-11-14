import bcrypt
import dataclasses
from bson import ObjectId
from datetime import datetime
from typing import Union, Tuple
from shared.models.common import Common
from nutri.db.users import get_user_collection
from nutri.models.interfaces import User as Input, Output
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
        elif self.input._id:
            query['_id'] = ObjectId(self.input._id)
        return query

    def defaults(self, user_data: dict) -> dict:
        user_data.pop('_id', None)
        return user_data

    def pop_immutable_fields(self, user_data: dict) -> dict:
        fields = ['createdDate']
        for field in fields:
            user_data.pop(field, None)
        return user_data

    def prep_data(self, user_data: dict, prev_user: dict = None) -> dict:
        if prev_user:
            user_data = self.pop_immutable_fields(user_data)
            user_data = Common.merge_dicts(user_data, prev_user)
        else:
            user_data = self.defaults(user_data)

        date_fields = ['createdDate']
        for field in date_fields:
            if user_data.get(field) and not isinstance(user_data[field], datetime):
                user_data[field] = Common.string_to_date(user_data, field)

        object_fields = ['_id']
        for field in object_fields:
            if user_data.get(field) and not isinstance(user_data[field], ObjectId):
                user_data[field] = ObjectId(user_data[field])

        if self.input.password:
            hashed_pass = bcrypt.hashpw(
                self.input.password.encode("utf-8"), bcrypt.gensalt())
            user_data['password'] = hashed_pass.decode("utf-8")

        user_data = Common.filter_none_values(user_data)
        return user_data

    def validate_phone(self) -> Union[dict, None]:
        user = self.users_collection.find_one(self.query)
        return user if user else None

    def update_user(self, user_data: dict, prev_user: dict) -> str:
        self.users_collection.update_one(self.query, {'$set': user_data})

        return 'Successfully updated user'

    def insert_user(self, user_data: dict) -> Tuple[str, dict]:
        user_data['_id'] = self.users_collection.insert_one(
            user_data).inserted_id

        message = 'Successfully created user'
        return message, user_data

    def compute(self) -> Output:
        user = self.input
        user_data = dataclasses.asdict(user)
        prev_user = self.validate_phone()
        if not prev_user:
            if not self.input.password or self.input.password.strip() == "":
                return Output(msg="Password is required")

        user_data = self.prep_data(user_data, prev_user)
        if prev_user:
            message = self.update_user(user_data, prev_user)
        else:
            message, user_data = self.insert_user(user_data)

        user_data = Common.jsonify(user_data)
        access_token = create_access_token(identity=user_data['_id'])
        refresh_token = create_refresh_token(identity=user_data['_id'])

        user_data['tokens'] = {
            'access': access_token,
            'refresh': refresh_token
        }

        return Output(
            msg=message,
            data=user_data
        )
