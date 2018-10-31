from flask import Flask, render_template
from flask_socketio import SocketIO
from game_manager import GameManager

app = Flask(__name__)
app.config['SECRET KEY'] = 'chinchirorin'
socketio = SocketIO(app)
manager = GameManager()


def show_players():
    socketio.emit('clearList')
    for player in manager.players:
        socketio.emit('showPlayers', player)

def abort_game():
    print('Game aborted')

def choose_dealer():
    socketio.emit('chooseDealer',manager.players[manager.current_player])

@socketio.on('dealerChosen')
def dealer_chosen(dealer):
    manager.dealer = dealer
    manager.state = 'roll'
    socketio.emit('pressRoll')

@socketio.on('nextPlayer')
def ask_next_player():
    manager.current_player = (manager.current_player + 1) % len(manager.players)
    choose_dealer()

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join')
def player_join(player, methods=['GET', 'POST']):
    print('received join: ' + str(player))
    if not manager.started:
        manager.players.append(player)
        show_players() 
        print(manager.players)
        if len(manager.players) >= 2: socketio.emit('showStartButton')

@socketio.on('leave')
def player_leave(player, methods=['GET','POST']):
    print('disconnected %s'%player)
    if player in manager.players:
        manager.players.remove(player)
    show_players()
    print(manager.players)
    if len(manager.players) < 2: 
        socketio.emit('hideStartButton')
        if manager.started:
            manager.started = False
            abort_game()

@socketio.on('start')
def start_game(player):
    if player in manager.players:
        manager.start_game()
        socketio.emit('showTable',manager.players)
        manager.started = True        
        choose_dealer()

if __name__ == '__main__':
    socketio.run(app, debug=True)