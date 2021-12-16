"""
  __init.py
    Core back-end
"""

from pathlib import Path

from flask_socketio import send
from flask_socketio import SocketIO as sio
from flask import Flask, send_from_directory
from flask import render_template, request, session

# Working directory 
path = Path(Path().resolve())

# Compiled React dir (parent/build)
static_index = path.parent.absolute() / 'build'

# App init
app = Flask(__name__)

# Set static folder as our compiled React project 
app = Flask(__name__, static_url_path='', static_folder=static_index)

# Remove cors_allowed_origins="*" on deployment 
socketio = sio(app, async_mode='threading', async_handlers=True, cors_allowed_origins="*")



# String wrapper func
def starts(var, string):
    try:
        if var.startswith(string): return True
        else: return False
    except AttributeError as e:
        if var[0].startswith(string): return True
        else: return False



# Socket messages 
@socketio.on('message')
def handle_message(data):

    # A client has connected to our webpage
    if starts(data, '[hello]'):
        print(' [#] Client connected! Sending response..')
        socketio.emit('message', '[response] hello from python!')
    


# Rename this to '/' on deployment
@app.route("/idx", defaults={'path':'idx'})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')



# Init 
if __name__ == '__main__':

    
    # app.config['SECRET_KEY'] = "1234"

    # Change this on deployment 
    socketio.run(app, host='localhost', port=5001, debug=True)
    # '0.0.0.0'
    # 
    # 'localhost'
