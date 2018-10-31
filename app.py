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

@socketio.on('updateBet')
def updateBet(bet,i,methods=['GET', 'POST']):
    new_bet = min(manager.players[i]['money'], int(bet))
    manager.players[i]['bet'] = new_bet
    manager.players[i]['money'] -= new_bet
    manager.has_bet += 1
    socketio.emit('updateTable',[manager.players[i], i])
    if manager.has_bet == len(manager.players)-1:
        manager.state = 'roll'
        socketio.emit('pressRoll')

@socketio.on('dealerChosen')
def dealer_chosen(dealer):
    print('dealer is ',dealer)
    manager.dealer = dealer
    socketio.emit('showBet', [manager.players, manager.dealer])

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
    for i in manager.players:
        if player['user_name'] == i['user_name']:
            manager.players.remove(i)
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