# Installation

## => Build the React app

cd to /web/

Run `npm install` to install node dependencies

Run `npm run build` to generate compiled build directory that our Python server will render

## => Install Python requirements 

cd to /web/server/ 

Run `pip install -r requirements.txt`

To start the server run `__init.py`

App runs on port 5001 which may be changed if necessary (`/web/src/config.js` & `/web/server/flask_domain.txt`)

See full documentation about [deploying a Flask-SocketIO app](https://flask-socketio.readthedocs.io/en/latest/deployment.html)
