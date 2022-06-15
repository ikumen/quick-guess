# Quick Guess

A guessing game similiar to pictionary, where you do the guessing while your browser does the drawing and listening. Your browser draws the picture using data from [Google's Quick Draw!](https://github.com/googlecreativelab/quickdraw-dataset) data set, and evaluates your guesses using [Azure's Speech to Text service](https://azure.microsoft.com/en-us/services/cognitive-services/speech-to-text/).


<img src="/docs/screen0.png" width="150"> <img src="/docs/screen1.png" width="150"> <img src="/docs/screen2.png" width="150"> <img src="/docs/screen3.png" width="150"> <img src="/docs/screen4.png" width="150"> <img src="/docs/screen5.png" width="150">

Check out the game here:

https://quickguess.azurewebsites.net/


## Local Development 

### Prerequisite

Before you can run a local instance of Quick Guess, you need to have or install.

- [create an account with Deepgram](https://console.deepgram.com/signup) and [grap an API key](https://developers.deepgram.com/documentation/getting-started/authentication/#create-an-api-key) (it should be a key with create key privileges)
- npm
- Python 3
- pip
- docker (required to run Mongo, can skip if you have access to a Mongo server)

#### Python

```bash
# from the project root setup virtual env
python -m venv .venv
source .venv/bin/activate

# installing dependencies
(.venv) pip install -r requirements.txt
```

### Drawing Data Set

Quick Guess, uses the [Quick Draw!](https://github.com/googlecreativelab/quickdraw-dataset) to draw the pictures. 

Grab the drawing data, they are big files so just a couple of files will do for dev.

https://github.com/googlecreativelab/quickdraw-dataset (specifically the simplified drawing files), it's hosted on Google cloud

- the drawings will be named `full_simplified_<word>.ndjson`, make sure you have the right drawing format
- save the downloaded files to `<project-root>/dataset/drawings`
- make sure you have a local instance of Mongo running, here's an example with Docker
    ```bash
    docker run --name mymongo \
      -p 27017:27017 \
      -v /full/path/data:/data/db \
      -e MONGO_INITDB_ROOT_USERNAME=root \
      -e MONGO_INITDB_ROOT_PASSWORD=password \
      -it mongo
    ```
    you can also use the included `docker-compose.yaml`
- assuming you've already set up your Python virtual env, install dependencies, run the importer
    ```bash
    cd <project-root>
    # setup virtual env
    # installing dependencies
    # see above
    
    # run the import script
    (.venv) python -m dataset.dataset_importer --drawings
    ```

### Backend Server

The backend serves two purposes:
1. proxies Deepgram to provide a short-lived access token
1. provides a simple API for drawing data

To run the server:

- create a `.env` at the project root, or use the `.env-example` and rename it to `.env`. 
- add/update the following config properties
    ```
    MONGO_URI=mongodb://root:password@localhost:27017
    MONGO_DB_NAME=admin

    DEEPGRAM_API_SECRET=
    DEEPGRAM_API_PROJECT_KEYS_URL=
    ```
- assuming you've already set up Python virtual env, install dependencies and start the server
    ```bash
    cd <project-root>
    # setup virtual env
    # installing dependencies
    # see above

    # if you need to add dependencies, add them to requirements.in, then
    (.venv) pip install pip-tools
    (.venv) pip-compile requirements.in
    (.venv) pip install -r requirements.txt

    # run the backend server
    (.venv) python application
    ```

Once the server is up, just point your browser to 

http://localhost:5000

### Frontend Server

The frontend is just a simple React app, that serves the main interface to play the game.

To run the frontend:

```bash
cd <project-root>
npm install --prefix frontend
npm start --prefix frontend
```

In the development, the frontend is actually being serve by it's own server, and all calls to /api (e.g, backend) are proxied (see end of `package.json`)

