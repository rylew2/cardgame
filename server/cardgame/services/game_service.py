# ./server/cardgamey/services/game_service.py

from ..enums import CARD_STATUS, GAME_PHASE, RANK
from ..models import Card, Game
from ..util.db_utils import clear_db, seed_db


class GameQueryService:
    @staticmethod
    def get_cards_left_in_deck(game):
        return Card.objects.filter(game=game, status=CARD_STATUS.DECK.value).count()

    @staticmethod
    def get_aces_left_in_deck(game):
        return Card.objects.filter(
            game=game, status=CARD_STATUS.DECK.value, rank=RANK.ACE.value
        ).count()

    @staticmethod
    def get_aces_left_in_hand(game):
        return Card.objects.filter(
            game=game, status=CARD_STATUS.HAND.value, rank=RANK.ACE.value
        ).count()

    @staticmethod
    def get_latest_game_status(game):
        return game.game_phase

    @staticmethod
    def get_current_game():
        return Game.objects.latest("created_at")

    @staticmethod
    def get_deck(game):
        return Card.objects.filter(game=game, status=CARD_STATUS.DECK.value)


class GameMutationService:
    @staticmethod
    def discard_cards_in_hand(game):
        cards_in_hand = Card.objects.filter(game=game, status=CARD_STATUS.HAND.value)
        for card in cards_in_hand:
            card.status = CARD_STATUS.DISCARDED.value

        # bulk update here instead of saving each individually in the loop above to minimize db hits
        Card.objects.bulk_update(cards_in_hand, ['status'])


    @staticmethod
    def deal_cards(game, count):
        cards_in_deck = Card.objects.filter(game=game, status=CARD_STATUS.DECK.value)

        if len(cards_in_deck) < count:
            raise ValueError("Not enough cards in the deck.")

        GameMutationService.discard_cards_in_hand(game)

        random_dealt_cards = cards_in_deck.order_by("?")[:count]

        for card in random_dealt_cards:
            card.status = CARD_STATUS.HAND.value

        # bulk update here instead of saving each individually in the loop above to minimize db hits
        Card.objects.bulk_update(random_dealt_cards, ['status'])

        aces_left_in_deck = GameQueryService.get_aces_left_in_deck(game)
        aces_in_hand = GameQueryService.get_aces_left_in_hand(game)
        updated_deck_count = Card.objects.filter(game=game, status=CARD_STATUS.DECK.value).count()

        if aces_left_in_deck == 0:
            if aces_in_hand >= 1 and updated_deck_count == 0:
                game.game_phase = GAME_PHASE.WON.value
            else:
                game.game_phase = GAME_PHASE.LOST.value
            game.save()

        return random_dealt_cards

    @staticmethod
    def reset_game():
        clear_db()
        seed_db()
