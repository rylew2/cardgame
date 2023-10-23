# server/tests/test_deal_cards.py

import json

from cardgame.enums import CARD_STATUS, GAME_PHASE, RANK, SUIT
from cardgame.models import Card, Game
from django.test import Client, TestCase


class DealCardsTestCase(TestCase):
    def setUp(self):
        # Create a test game and some cards for testing
        self.game = Game.objects.create(game_phase=GAME_PHASE.IN_PROGRESS.value)
        for suit in SUIT:
            for rank in RANK:
                Card.objects.create(
                    suit=suit.value,
                    rank=rank.value,
                    game=self.game,
                    status=CARD_STATUS.DECK.value,
                )

    def test_deal_cards_mutation(self):
        # GraphQL mutation query
        mutation_query = """
            mutation DealCardsMutation($count: Int!) {
                dealCards(count: $count) {
                    success
                    message
                    dealtCards {
                        id
                        suit
                        status
                        rank
                    }
                    cardsLeftInDeck
                    acesLeftInDeck
                }
            }
        """

        # Set the count for dealing cards
        count = 5

        # Create a GraphQL client
        client = Client()

        # Execute the mutation with the specified count
        response = client.post(
            "/graphql/",
            json.dumps(
                {
                    "query": mutation_query,
                    "variables": {"count": count},
                }
            ),
            content_type="application/json",
        )

        # Check if the response status code is 200
        assert response.status_code == 200

        # Parse the response data
        data = response.json()

        # Check the expected keys in the response
        self.assertIn("data", data)
        self.assertIn("dealCards", data["data"])

        # Check the success flag in the response
        self.assertIn("success", data["data"]["dealCards"])
        self.assertIsInstance(data["data"]["dealCards"]["success"], bool)

        # Check the message in the response
        self.assertIn("message", data["data"]["dealCards"])
        self.assertIsInstance(data["data"]["dealCards"]["message"], str)

        # Check the dealtCards in the response
        self.assertIn("dealtCards", data["data"]["dealCards"])
        self.assertIsInstance(data["data"]["dealCards"]["dealtCards"], list)

        self.assertEqual(len(data["data"]["dealCards"]["dealtCards"]), 5)

        for card in data["data"]["dealCards"]["dealtCards"]:
            self.assertIn("id", card)
            self.assertIn("suit", card)
            self.assertIn("status", card)
            self.assertIn("rank", card)

        # Check the cardsLeftInDeck in the response
        self.assertIn("cardsLeftInDeck", data["data"]["dealCards"])
        self.assertIsInstance(data["data"]["dealCards"]["cardsLeftInDeck"], int)

        # Check the acesLeftInDeck in the response
        self.assertIn("acesLeftInDeck", data["data"]["dealCards"])
        self.assertIsInstance(data["data"]["dealCards"]["acesLeftInDeck"], int)

    def test_combined_query(self):
        # GraphQL query for combined query
        query = """
            query {
                cardsLeftInDeck
                acesLeftInDeck
                gameStatus
            }
        """

        client = Client()
        response = client.get("/graphql/", {"query": query})

        assert response.status_code == 200

        data = json.loads(response.content)

        self.assertIn("data", data)
        self.assertIn("cardsLeftInDeck", data["data"])
        self.assertEqual(data["data"]["cardsLeftInDeck"], 52)

        self.assertIn("acesLeftInDeck", data["data"])
        self.assertEqual(data["data"]["acesLeftInDeck"], 4)

        self.assertIn("gameStatus", data["data"])
        self.assertEqual(data["data"]["gameStatus"], GAME_PHASE.IN_PROGRESS.value)
