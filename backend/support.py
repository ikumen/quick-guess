import json
import typing

from bson import objectid
from datetime import datetime
from starlette.responses import JSONResponse


class MongoEntityJSONEncoder(json.JSONEncoder):
    """Custom JSONEncoder that can handle serializing a Mongo entity.
    Specifically we assume any entity that can be persisted to Mongo will have
    an ObjectId (e.g, _id), created_at and updated_at dates.
    """
    def _normalize_fields(self, o):
        o['id'] = o['_id']
        del o['_id']

    def iterencode(self, o: typing.Any, _one_shot: bool) -> typing.Iterator[str]:
        if isinstance(o, typing.List) and len(o) and '_id' in o[0]:
            for item in o:
                self._normalize_fields(item)
        elif isinstance(o, typing.Dict) and '_id' in o:
            self._normalize_fields(o)
        return super().iterencode(o, _one_shot=_one_shot)

    def default(self, o: typing.Any) -> typing.Any:
        if isinstance(o, objectid.ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        else:
            return super().default(o)

custom_jsonencoder = MongoEntityJSONEncoder()


class ApiJSONResponse(JSONResponse):
    """Custon JSONResponse that can properly serialize objects using the
    CustomJSONEncoder, used mainly api request handlers.
    """
    def render(self, content: typing.Any) -> bytes:
        return custom_jsonencoder.encode(content).encode('utf-8')
