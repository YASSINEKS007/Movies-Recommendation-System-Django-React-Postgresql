from pymongo import MongoClient
from decouple import config


def get_db_handle():
    try:
        client = MongoClient(
            host=config("MONGODB_HOST"),
            port=int(config("MONGODB_PORT")),
            username=config("MONGODB_USER"),
            password=config("MONGODB_PASSWORD"),
        )

        db = client[config("MONGODB_NAME")]

    except Exception as e:
        print(f"Failed to connect to the database: {e}")
        return None, None

    return db, client
