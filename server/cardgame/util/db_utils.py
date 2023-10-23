from django.db import connection

from ..enums import CARD_STATUS, GAME_PHASE, RANK, SUIT
from ..models import Card, Game


def seed_db():
    if not Game.is_seeded():
        game = Game.objects.create(game_phase=GAME_PHASE.IN_PROGRESS.value)

        for suit in SUIT:
            for rank in RANK:
                Card.objects.create(
                    suit=suit.value,
                    rank=rank.value,
                    game=game,
                    status=CARD_STATUS.DECK.value,
                )

    else:
        print("Database is already seeded.")


def clear_db():
    Game.objects.all().delete()
    Card.objects.all().delete()

    # Reset ID counter
    with connection.cursor() as cursor:
        cursor.execute("ALTER SEQUENCE cardgamey_game_id_seq RESTART WITH 1")

    with connection.cursor() as cursor:
        cursor.execute("ALTER SEQUENCE cardgamey_card_id_seq RESTART WITH 1")
