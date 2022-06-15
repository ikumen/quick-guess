import random

from pymongo import MongoClient, database
from typing import List
from backend import settings


class MongoDatastore:
    """Generic class wrapper around Mongo DB operations around a collection.
    """
    def __init__(self, collection_name: str, db: database.Database = None):
        self.init(collection_name, db)

    def init(self, collection_name: str, db: database.Database = None):
        """Initialize this store, with the given mongo Database or create one
        if necessary, and create a reference to the underlying collection this
        store will represent.
        """
        if db is None:
            mongo_client = MongoClient(settings.MONGO_URI)
            db = mongo_client.get_database(settings.MONGO_DB_NAME)
        self.collection = db.get_collection(collection_name)

    def clear(self):
        self.collection.drop()

    def save(self, entity, required_attrs):
        if not all (k in entity for k in required_attrs):
            raise KeyError()
        return self.collection.insert_one(entity)

    def apply_indexes(self, indexes):
        for index in indexes:
            self.collection.create_index(index)
        

class DrawingDatastore(MongoDatastore):
    def __init__(self):
        super().__init__(collection_name='drawings')

    def get_drawing_words(self):
        # return list(self.collection.aggregate([{'$group': {'_id': '$word', 'count': {'$sum': 1}}}]))
        return list(self.collection.distinct('word'))

    def apply_indexes(self):
        super().apply_indexes(indexes=['word', 'n'])

    def save(self, drawing):
        return super().save(drawing, ['_id', 'word', 'drawing', 'n'])

    def get_random_drawing(self, word: str):
        n = random.randint(1, 100)
        # pprint.pprint(self.collection.find({'n': n, 'word': word}).explain()['executionStats'])
        return self.collection.find_one({'n': n, 'word': word})


drawingDatabase = DrawingDatastore()
