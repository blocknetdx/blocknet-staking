"""
  __init.py

    Backend core
"""

import __api as api

import os
import json
from flask_socketio import SocketIO as sio
from flask import Flask, send_from_directory, request 

# Compiled React directory (<parent>/build)
static_index = '../build'

# Initialize the app
app = Flask(__name__)

# Set static folder as our compiled React project 
app = Flask(__name__, static_url_path='', static_folder=static_index)

# Remove cors_allowed_origins="*" on deployment 
socketio = sio(app, async_mode='threading', cors_allowed_origins="*", async_handlers=True)


def starts(var, string):

    # String wrapper function
    # (if string starts with a substring)
    try:
        if var.startswith(string): return True
        else: return False
    except AttributeError as e:
        if var[0].startswith(string): return True
        else: return False


@socketio.on('disconnect', namespace='/')
def socket_disconnect():

    # Just for debug 
    print(' [#] Client disconnected:', request.sid)


@socketio.on('message')
def handle_message(data):

    # Listen for socket messages 
    # A client has connected to our webpage
    if starts(data, '[connection]'):
        print(' [#] Client loaded:', request.sid)

        # Send clients their needed data
        # Format our json data, round up some decimals
        x = {
            "price": str(round(api.price, 3)),
            "supply": str(round(api.supply, 3)),
            "staking": str(round(api.staking, 3))
        }

        json_response = json.dumps(x)

        # Echo the json back to client
        socketio.emit('message', json_response, to=request.sid)

        # Let new clients know if we had some problems
        if api.raised:
            x = {"error": 'API Error'}
            json_response = json.dumps(x)
            socketio.emit('message', json_response, to=request.sid)


@app.route("/")
def serve():

    # Edit route to ("/"} on deployment
    # Client landed, render the index
    return send_from_directory(app.static_folder, 'index.html')


def main():

    # init 
    # Check if we're running production & Gunicorn 
    prod = os.getenv('PRODUCTION')

    # Start an API thread
    api.start_api_thread(socketio)

    # If we're not running via prod&Gunicorn we need to call socketio.run
    if not prod:
        # Get domain:port from file, edit this file on deployment
        f = open("flask_domain.txt", "r")
        domain = f.read()
        f.close()

        # Attempt to read the file 
        try:
            domain = domain.split(':')
            port = domain[1]
            domain = domain[0]
        except Exception as err:

            # Throw an exception if there was any funny business
            print(' [x] ERROR:', err)
            raise Exception(" Couldn't read " + str(path) + "\"" + "flask_domain.txt. < Syntax: domain:port >")

        socketio.run(app, host=domain, port=port)

    print(' [#] __init successful. Production', prod)


if __name__ == '__main__':

    # Called on development env only
    main()


# We need to call this on production since __name__ is not __main__
main()
