import os

from flask import Flask, render_template, url_for, request
from flask_socketio import SocketIO, emit
from datetime import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

class Channel:
    _ID = 0
    def __init__(self, name):
        self.id = self._ID; self.__class__._ID += 1
        self.name = name
        self.messages = []

class Message:
    _ID = 0
    def __init__(self, content):
        self.id = self._ID; self.__class__._ID += 1
        self.content = content
        now = datetime.now()
        self.timestamp = now

channels = []

def getChannel(id):
    for channel in channels:
        if channel.id == id:
            return channel

@app.route("/")
def index():
    return render_template("index.html", channels=channels)

@app.route("/chat/<int:channelID>")
def chat(channelID):
    chat_channel = getChannel(channelID)
    return render_template("chat.html", channel=chat_channel, channels=channels)

@socketio.on("create channel")
def create(name):
    # //channelName = data["name"]
    for channel in channels:
        if channel.name == name:
            emit("channel exists", name)
            return
    newChannel = Channel(name=name)
    channels.append(newChannel)
    id = newChannel.id
    #print('channel created, id is ', id)
    emit("channel created", (name, id), broadcast=True)

@socketio.on("new message")
def send(content, channelID):
    newMessage = Message(content=content)
    channelID = int(channelID)
    channel = getChannel(id=channelID)
    print(type(content))
    print(type(channelID))
    channel.messages.append(newMessage)
    print('CHANNEL ID IS', channelID)
