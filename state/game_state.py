class GameState:
    def __init__(self):
        self.current_state = "Introduction"
        # Add other game state-related attributes as needed
        self.player_progress = 0
        self.bias_level = 0
        

    def update_state(self, new_state):
        self.current_state = new_state

    def increase_progress(self):
        self.player_progress += 1

    def adjust_bias(self, amount):
        self.bias_level += amount

    def is_game_finished(self):
        return self.current_state == "finished"