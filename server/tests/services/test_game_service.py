import random

from cardgame.enums import CARD_STATUS, GAME_PHASE, RANK, SUIT
from cardgame.models import Card, Game
from cardgame.services.game_service import GameMutationService, GameQueryService
from django.test import TestCase


class GameServiceTestCase(TestCase):
    def setUp(self):
        self.game = Game.objects.create(game_phase=GAME_PHASE.IN_PROGRESS.value)
        for suit in SUIT:
            for rank in RANK:
                Card.objects.create(
                    suit=suit.value,
                    rank=rank.value,
                    game=self.game,
                    status=CARD_STATUS.DECK.value,
                )

    def test_get_cards_left_in_deck(self):
        cards_left_in_deck = GameQueryService.get_cards_left_in_deck(self.game)
        assert cards_left_in_deck == 52

    def test_get_aces_left_in_deck(self):
        aces_left_in_deck = GameQueryService.get_aces_left_in_deck(self.game)
        assert aces_left_in_deck == 4

    def test_get_latest_game_status(self):
        game_status = GameQueryService.get_latest_game_status(self.game)
        assert game_status == "In Progress"

    def test_deal_cards(self):
        GameMutationService.deal_cards(self.game, 5)
        deck_count_after_dealing = GameQueryService.get_cards_left_in_deck(self.game)
        cards_in_hand_count = Card.objects.filter(
            game=self.game, status=CARD_STATUS.HAND.value
        ).count()

        assert deck_count_after_dealing == 47
        assert cards_in_hand_count == 5

        GameMutationService.deal_cards(self.game, 5)
        deck_count_after_dealing = GameQueryService.get_cards_left_in_deck(self.game)
        cards_in_hand_count = Card.objects.filter(
            game=self.game, status=CARD_STATUS.HAND.value
        ).count()
        discarded_cards = Card.objects.filter(
            game=self.game, status=CARD_STATUS.DISCARDED.value
        ).count()
        assert discarded_cards == 5
        assert deck_count_after_dealing == 42
        assert cards_in_hand_count == 5

        GameMutationService.deal_cards(self.game, 5)
        deck_count_after_dealing = GameQueryService.get_cards_left_in_deck(self.game)
        cards_in_hand_count = Card.objects.filter(
            game=self.game, status=CARD_STATUS.HAND.value
        ).count()
        discarded_cards = Card.objects.filter(
            game=self.game, status=CARD_STATUS.DISCARDED.value
        ).count()
        assert discarded_cards == 10
        assert deck_count_after_dealing == 37
        assert cards_in_hand_count == 5

    def test_deal_invalid_count_of_cards(self):
        with self.assertRaisesMessage(ValueError, "Not enough cards in the deck."):
            GameMutationService.deal_cards(self.game, 53)


class GameStatus(TestCase):
    def test_game_won(self):
        # Create a test game with one Ace in hand and no cards left in the deck
        game = Game.objects.create(game_phase=GAME_PHASE.IN_PROGRESS.value)

        for _ in range(48):
            Card.objects.create(
                suit=random.choice(list(SUIT)).value,
                rank=random.choice(list(RANK)).value,
                game=game,
                status=CARD_STATUS.DISCARDED.value,
            )

        for _ in range(2):
            Card.objects.create(
                suit=random.choice(list(SUIT)).value,
                rank=RANK.ACE.value,
                game=game,
                status=CARD_STATUS.DECK.value,
            )

        Card.objects.create(
            suit=random.choice(list(SUIT)).value,
            rank=RANK.FIVE.value,
            game=game,
            status=CARD_STATUS.HAND.value,
        )

        Card.objects.create(
            suit=random.choice(list(SUIT)).value,
            rank=RANK.ACE.value,
            game=game,
            status=CARD_STATUS.HAND.value,
        )

        # Make sure there are no cards left in the deck
        assert GameQueryService.get_cards_left_in_deck(game) == 2

        GameMutationService.deal_cards(game, 2)

        assert GameQueryService.get_latest_game_status(game) == GAME_PHASE.WON.value

    def test_game_lost(self):
        # Create a test game with 27 cards left in the deck and one Ace in hand
        game = Game.objects.create(game_phase=GAME_PHASE.IN_PROGRESS.value)
        for _ in range(27):
            Card.objects.create(
                suit=random.choice(list(SUIT)).value,
                rank=RANK.FIVE.value,
                game=game,
                status=CARD_STATUS.DECK.value,
            )

        for _ in range(4):
            Card.objects.create(
                suit=random.choice(list(SUIT)).value,
                rank=RANK.FIVE.value,
                game=game,
                status=CARD_STATUS.HAND.value,
            )
        Card.objects.create(
            suit=random.choice(list(SUIT)).value,
            rank=RANK.ACE.value,
            game=game,
            status=CARD_STATUS.HAND.value,
        )

        assert GameQueryService.get_cards_left_in_deck(game) == 27
        assert GameQueryService.get_aces_left_in_deck(game) == 0

        GameMutationService.deal_cards(game, 5)

        assert GameQueryService.get_latest_game_status(game) == GAME_PHASE.LOST.value

    def test_reset_game(self):
        game = Game.objects.create(game_phase=GAME_PHASE.IN_PROGRESS.value)
        for _ in range(27):
            Card.objects.create(
                suit=random.choice(list(SUIT)).value,
                rank=RANK.FIVE.value,
                game=game,
                status=CARD_STATUS.DECK.value,
            )

        for _ in range(4):
            Card.objects.create(
                suit=random.choice(list(SUIT)).value,
                rank=RANK.FIVE.value,
                game=game,
                status=CARD_STATUS.HAND.value,
            )

        Card.objects.create(
            suit=random.choice(list(SUIT)).value,
            rank=RANK.ACE.value,
            game=game,
            status=CARD_STATUS.HAND.value,
        )

        assert GameQueryService.get_cards_left_in_deck(game) == 27
        assert GameQueryService.get_aces_left_in_deck(game) == 0
        assert GameQueryService.get_aces_left_in_hand(game) == 1

        GameMutationService.reset_game()

        new_game = GameQueryService.get_current_game()
        assert GameQueryService.get_cards_left_in_deck(new_game) == 52
        assert GameQueryService.get_aces_left_in_deck(new_game) == 4
        assert GameQueryService.get_aces_left_in_hand(new_game) == 0
