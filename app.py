from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET KEY'] = 'chinchirorin'
socketio = SocketIO(app)

players = []

def show_players():
    socketio.emit('clear list')
    for player in players:
        socketio.emit('show players', player, callback=messageReceived)

@app.route('/')
def sessions():
    return render_template('index.html')

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('join')
def player_join(json, methods=['GET', 'POST']):
    print('received join: ' + str(json))
    players.append(json)
    show_players() 

@socketio.on('leave')
def player_leave(json, methods=['GET','POST']):
    print('disconnected %s'%json)
    players.remove(json)
    show_players()

if __name__ == '__main__':
    socketio.run(app, debug=True)