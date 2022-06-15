import dotenv
import logging
import os

from pathlib import Path


dotenv_path = Path(__file__).parent.parent / '.env'
dotenv.load_dotenv(dotenv_path)

APP_NAME = os.getenv('APP_NAME', 'Notas')
APP_DEBUG = os.getenv('APP_DEBUG', 'false').lower() == 'true'
LOG_LVL = logging.getLevelName(os.getenv('LOG_LVL', 'INFO'))

# APP_ENV = os.environ['APP_ENV']

MONGO_URI = os.environ['MONGO_URI']
MONGO_DB_NAME = os.environ['MONGO_DB_NAME']

DEEPGRAM_API_SECRET = os.environ['DEEPGRAM_API_SECRET']
DEEPGRAM_API_PROJECT_KEYS_URL = os.environ['DEEPGRAM_API_PROJECT_KEYS_URL']

# Logging config
logging.basicConfig(level=LOG_LVL, 
    format='%(asctime)s| %(levelname)-8s| %(name)s - %(message)s')
    