from pathlib import Path
from starlette.routing import Route
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates


frontend_path = Path(__file__).parent.parent.parent / 'frontend/build'
templates = Jinja2Templates(directory=frontend_path)


# Handler definitions
async def index(req):
    """Entry point for our web app (single-page app)"""
    return templates.TemplateResponse('index.html', {'request': req})


# Handler to route mappings
routes = [
    Route('/{path:path}', endpoint=index)
]