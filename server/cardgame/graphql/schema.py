# ./server/cardgamey/graphql/schema.py

import graphene
from cardgame.graphql.types.deal_cards import DealCards
from cardgame.graphql.types.logout_user import LogoutUser
from cardgame.graphql.types.reset_game import ResetGame
from cardgame.graphql.types.user import User as UserNode
from cardgame.services.game_service import GameQueryService


class Query(graphene.ObjectType):
    """Queries specific to cardgamey app."""

    class Meta:
        abstract = True

    me = graphene.Field(UserNode)
    cards_left_in_deck = graphene.Int()
    aces_left_in_deck = graphene.Int()
    game_status = graphene.String()

    def resolve_cards_left_in_deck(self, info):
        game = GameQueryService.get_current_game()
        return GameQueryService.get_cards_left_in_deck(game)

    def resolve_aces_left_in_deck(self, info):
        game = GameQueryService.get_current_game()
        return GameQueryService.get_aces_left_in_deck(game)

    def resolve_game_status(self, info):
        game = GameQueryService.get_current_game()
        return GameQueryService.get_latest_game_status(game)

    def resolve_me(self, info, **kwargs):
        """Return the current logged in user."""
        return info.context.user


class Mutation(graphene.ObjectType):
    """Mutations specific to cardgamey app."""

    class Meta:
        abstract = True

    logout_user = LogoutUser.Field(description="Log the user out.")
    deal_cards = DealCards.Field(
        description="Deal a certain count of cards from the deck to user's hand"
    )
    reset_game = ResetGame.Field(
        description="Clear the db and reseed with a new game and deck"
    )
