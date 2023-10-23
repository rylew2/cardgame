from django.db import models

from .enums import CARD_STATUS, GAME_PHASE, RANK, SUIT


class Game(models.Model):
    game_phase = models.CharField(
        max_length=20,
        choices=[(phase.value, phase.value) for phase in GAME_PHASE],
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def is_seeded():
        return Game.objects.exists()

    def __str__(self):
        return f"Game {self.id}"


class Card(models.Model):
    suit = models.CharField(max_length=10, choices=[(suit.value, suit.value) for suit in SUIT])
    rank = models.CharField(max_length=5, choices=[(rank.value, rank.value) for rank in RANK])
    status = models.CharField(
        max_length=20,
        choices=[(status.value, status.value) for status in CARD_STATUS],
        default=CARD_STATUS.DECK.value,
    )
    game = models.ForeignKey(Game, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.rank} of {self.suit}"
