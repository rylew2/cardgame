import graphene

from graphene_django import DjangoObjectType

from ...models import Card
from ...services.game_service import GameMutationService, GameQueryService


class CardType(DjangoObjectType):
    class Meta:
        model = Card
        fields = ("id", "suit", "status")

    rank = graphene.String()


class DealCards(graphene.Mutation):
    class Arguments:
        count = graphene.Int(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    dealt_cards = graphene.List(CardType)
    cards_left_in_deck = graphene.Int()
    aces_left_in_deck = graphene.Int()
    game_status = graphene.String()
    deck = graphene.List(CardType)

    def mutate(self, info, count):
        if not 1 <= count <= 5:
            raise ValueError("You can only deal between 1 to 5 cards at a time.")

        try:
            game = GameQueryService.get_current_game()
            dealt_cards = GameMutationService.deal_cards(game, count)
            success = True
            message = f"Successfully dealt {count} cards."

        except ValueError as error:
            dealt_cards = []
            success = False
            message = str(error)

        cards_left_in_deck = GameQueryService.get_cards_left_in_deck(game)
        aces_left_in_deck = GameQueryService.get_aces_left_in_deck(game)
        game_status = GameQueryService.get_latest_game_status(game)
        deck = GameQueryService.get_deck(game)

        return DealCards(
            success=success,
            message=message,
            dealt_cards=dealt_cards,
            cards_left_in_deck=cards_left_in_deck,
            aces_left_in_deck=aces_left_in_deck,
            game_status=game_status,
            deck=deck,
        )
