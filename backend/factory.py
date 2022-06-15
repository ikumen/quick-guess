from pathlib import Path

from starlette.staticfiles import StaticFiles
from starlette.applications import Starlette
from starlette.routing import Mount
from backend import settings
from backend.routes import deepgram_api, drawings_api, web


frontend_path = Path(__file__).parent.parent / 'frontend/build'

def create_app():
    app = Starlette(
        debug=settings.APP_DEBUG, 
        routes=[
            Mount('/api/deepgram', routes=deepgram_api.routes),
            Mount('/api/drawings', routes=drawings_api.routes),
            Mount('/static', app=StaticFiles(directory=frontend_path / 'static')),
            Mount('/', routes=web.routes)])
    return app
