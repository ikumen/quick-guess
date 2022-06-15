import logging
import json
import requests

from datetime import datetime
from starlette.requests import Request
from starlette.routing import Route
from starlette.exceptions import HTTPException

from backend import settings
from backend.support import ApiJSONResponse


logger = logging.getLogger(__name__)


def _log_exception(ex: Exception):
    logger.warn(f"Caught {type(ex).__name__}. {ex}")


async def get_deepgram_access_token(req: Request):
    req_payload = {
        'comment': f'Temp token, create: {str(datetime.now())}',
        'time_to_live_in_seconds': 600, # TODO: make configurable
        'scopes': ['member']}

    res = requests.post(
        url = settings.DEEPGRAM_API_PROJECT_KEYS_URL,
        data = json.dumps(req_payload),
        headers = {
          'Authorization': f'Token {settings.DEEPGRAM_API_SECRET}',
          'Content-Type': 'application/json'  
        })

    if res.status_code == 200:
        return ApiJSONResponse(content=res.json())
    raise HTTPException(
        status_code=res.status_code, 
        detail=res.reason)


routes = [
    Route('/token', endpoint=get_deepgram_access_token, methods=['GET']),
]