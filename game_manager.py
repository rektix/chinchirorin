starting_money = 2000

class GameManager:
    def __init__(self):
        self.started = False
        self.players = []
        self.state = ''
        self.current_player = 0
        self.dealer = ''

    def start_game(self):
        self.state = 'choose dealer'
        for player in self.players:
            player['money'] = starting_money
            player['bet'] = 0