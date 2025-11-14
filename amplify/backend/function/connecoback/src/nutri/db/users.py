from pymongo.collection import Collection
from shared.db.base import Database

def get_user_collection() -> Collection:
    client = Database().client

    db = client['nutridb']
    users_collection = db["users"]
    return users_collection