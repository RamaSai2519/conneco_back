from shared.db.base import Database
from pymongo.collection import Collection


def get_user_collection() -> Collection:
    client = Database().client

    db = client['nutribot']
    users_collection = db["users"]
    return users_collection
