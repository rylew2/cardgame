import graphene

from ...services.game_service import GameMutationService, GameQueryService
from .deal_cards import CardType


class ResetGame(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()
    cards_left_in_deck = graphene.Int()
    aces_left_in_deck = graphene.Int()
    game_status = graphene.String()
    deck = graphene.List(CardType)

    def mutate(self, info):
        try:
            GameMutationService.reset_game()
            message = "The game has successfully been reset."
            success = True

            game = GameQueryService.get_current_game()
            cards_left_in_deck = GameQueryService.get_cards_left_in_deck(game)
            aces_left_in_deck = GameQueryService.get_aces_left_in_deck(game)
            game_status = GameQueryService.get_latest_game_status(game)
            deck = GameQueryService.get_deck(game)

        except ValueError as error:
            success = False
            message = f"An error occurred during game reset: {error}"
            cards_left_in_deck = None
            aces_left_in_deck = None
            game_status = None

        return ResetGame(
            success=success,
            message=message,
            cards_left_in_deck=cards_left_in_deck,
            aces_left_in_deck=aces_left_in_deck,
            game_status=game_status,
            deck=deck,
        )
