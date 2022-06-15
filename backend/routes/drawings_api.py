import logging

from starlette.requests import Request
from starlette.routing import Route
from starlette.exceptions import HTTPException

from backend.datastores import drawingDatabase
from backend.support import ApiJSONResponse


logger = logging.getLogger(__name__)


async def get_drawing_words(req: Request):
    words = drawingDatabase.get_drawing_words()
    return ApiJSONResponse(content=words)

async def get_random_drawing(req: Request):
    word = req.query_params.get('word')
    if word:
        drawing = drawingDatabase.get_random_drawing(word=word)
        return ApiJSONResponse(content=drawing)
    raise HTTPException(status_code=400, detail='Missing query parameter "word"')


routes = [
    Route('/words', endpoint=get_drawing_words, methods=['GET']),
    Route('/random', endpoint=get_random_drawing, methods=['GET']),
]