"""
  __init.py

    Backend core
"""

import __api as api

from pathlib import Path

from flask_socketio import send
from flask_socketio import SocketIO as sio
from flask import Flask, send_from_directory
from flask import render_template, request, session

# Working directory 
path = Path(Path().resolve())

# Compiled React dir (<parent>/build)
static_index = path.parent.absolute() / 'build'

# App init
app = Flask(__name__)

# Set static folder as our compiled React project 
app = Flask(__name__, static_url_path='', static_folder=static_index)

# Remove cors_allowed_origins="*" on deployment 
socketio = sio(app, async_mode='threading', async_handlers=True, cors_allowed_origins="*")



def starts(var, string):

    # String wrapper function

    try:
        if var.startswith(string): return True
        else: return False
    except AttributeError as e:
        if var[0].startswith(string): return True
        else: return False



@socketio.on('message')
def handle_message(data):

    # Listen for socket messages 

    # A client has connected to our webpage
    if starts(data, '[connection]'):
        print(' [#] Client connected.')
        socketio.emit('message', '[price] ' + str(api.price))
        socketio.emit('message', '[supply] ' + str(api.supply))
        socketio.emit('message', '[staking] ' + str(api.staking))



@app.route("/idx", defaults={'path':'idx'})
def serve(path):
    # Rename this to '/' on deployment

    return send_from_directory(app.static_folder, 'index.html')



if __name__ == '__main__':

    # init 
    
    # Start an API thread
    api.start_api_thread()

    # Change this on deployment 
    socketio.run(app, host='0.0.0.0', port=5001)

    # '0.0.0.0'
    # 'localhost'
