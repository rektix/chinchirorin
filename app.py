from flask import Flask, render_template
from flask_socketio import SocketIO
from game_manager import GameManager

app = Flask(__name__)
app.config['SECRET KEY'] = 'chinchirorin'
socketio = SocketIO(app)
manager = GameManager()

players = []

def show_players():
    socketio.emit('clearList')
    for player in players:
        socketio.emit('showPlayers', player)

def abort_game():
    print('Game aborted')

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join')
def player_join(player, methods=['GET', 'POST']):
    print('received join: ' + str(player))
    if not manager.started:
        players.append(player)
        show_players() 
        print(players)
        if len(players) >= 2: socketio.emit('showStartButton')

@socketio.on('leave')
def player_leave(player, methods=['GET','POST']):
    print('disconnected %s'%player)
    if player in players:
        players.remove(player)
    show_players()
    print(players)
    if len(players) < 2: 
        socketio.emit('hideStartButton')
        if manager.started:
            manager.started = False
            abort_game()

@socketio.on('start')
def start_game(player):
    if player in players:
        socketio.emit('showTable',players)
        manager.started = True

if __name__ == '__main__':
    socketio.run(app, debug=True)