from enum import Enum


class SUIT(Enum):
    CLUB = "Club"
    DIAMOND = "Diamond"
    HEART = "Heart"
    SPADE = "Spade"


class RANK(Enum):
    TWO = "2"
    THREE = "3"
    FOUR = "4"
    FIVE = "5"
    SIX = "6"
    SEVEN = "7"
    EIGHT = "8"
    NINE = "9"
    TEN = "10"
    JACK = "JACK"
    QUEEN = "QUEEN"
    KING = "KING"
    ACE = "ACE"


class GAME_PHASE(Enum):
    IN_PROGRESS = "In Progress"
    WON = "Won"
    LOST = "Lost"


class CARD_STATUS(Enum):
    DECK = "Deck"
    HAND = "Hand"
    DISCARDED = "Discarded"
