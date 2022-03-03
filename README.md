# Local installation

## => Build the React app

cd to /web/

Run `npm install` to install node dependencies

Run `npm run build` to generate compiled build directory that our Python server will render

## => Install Python requirements 

cd to /web/server/ 

Run `pip install -r requirements.txt`

To start the server run `__init.py`

App runs on port 5001 which may be changed if necessary (`/web/src/config.js` & `/web/server/flask_domain.txt`)

# Deployment

## => Build the docker image and run it 

`docker build -t staking-calc .` to build a docker image

`docker run --rm -p 3000:3000 staking-calc` to start the docker container (runs on port 3000)

• NOTE: Socket IO should be configured to run on server IP. 
Currently set for 0.0.0.0 (127.0.0.1): ![img](https://i.gyazo.com/bd057a80b8b48762082ea266dba57e3c.png)

Configure this from (`/web/src/config.js`) before building the docker image
<br>

Full documentation about [deploying a Flask-SocketIO app](https://flask-socketio.readthedocs.io/en/latest/deployment.html)
