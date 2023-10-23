import json
import random

from cardgame.enums import CARD_STATUS, GAME_PHASE, RANK, SUIT
from cardgame.models import Card, Game
from django.test import Client, TestCase


class ResetGameTestCase(TestCase):
    def setUp(self):
        # Create a test game and some cards for testing
        self.game = Game.objects.create(game_phase=GAME_PHASE.IN_PROGRESS.value)

        for _ in range(20):
            Card.objects.create(
                suit=random.choice(list(SUIT)).value,
                rank=RANK.FIVE.value,
                game=self.game,
                status=CARD_STATUS.DISCARDED.value,
            )

        for _ in range(27):
            Card.objects.create(
                suit=random.choice(list(SUIT)).value,
                rank=RANK.FIVE.value,
                game=self.game,
                status=CARD_STATUS.DECK.value,
            )

        for _ in range(4):
            Card.objects.create(
                suit=random.choice(list(SUIT)).value,
                rank=RANK.FIVE.value,
                game=self.game,
                status=CARD_STATUS.HAND.value,
            )

        Card.objects.create(
            suit=random.choice(list(SUIT)).value,
            rank=RANK.ACE.value,
            game=self.game,
            status=CARD_STATUS.HAND.value,
        )

    def test_reset_game_mutation(self):
        # GraphQL mutation query
        mutation_query = """
            mutation ResetGameMutation {
                resetGame {
                    success
                    message
                    cardsLeftInDeck
                    acesLeftInDeck
                    gameStatus
                }
            }
        """

        # Create a GraphQL client
        client = Client()

        # Execute the mutation
        response = client.post(
            "/graphql/",
            json.dumps(
                {
                    "query": mutation_query,
                }
            ),
            content_type="application/json",
        )

        assert response.status_code == 200

        data = response.json()

        assert data["data"]["resetGame"]["success"] is True
        assert (
            data["data"]["resetGame"]["message"]
            == "The game has successfully been reset."
        )
        assert data["data"]["resetGame"]["cardsLeftInDeck"] == 52
        assert data["data"]["resetGame"]["acesLeftInDeck"] == 4
        assert data["data"]["resetGame"]["gameStatus"] == GAME_PHASE.IN_PROGRESS.value
