import { CardType, Maybe } from '../graphql/generatedTypes/graphql';
import { DealCardsMutationResult } from '../graphql/graphqlService';
import { Card, CardSuit, CardNumber } from './cardUtil';

type CardArray = Maybe<Maybe<CardType>[]> | undefined;

const rankMap: { [key: string]: CardNumber } = {
  '2': CardNumber.Two,
  '3': CardNumber.Three,
  '4': CardNumber.Four,
  '5': CardNumber.Five,
  '6': CardNumber.Six,
  '7': CardNumber.Seven,
  '8': CardNumber.Eight,
  '9': CardNumber.Nine,
  '10': CardNumber.Ten,
  JACK: CardNumber.Jack,
  QUEEN: CardNumber.Queen,
  KING: CardNumber.King,
  ACE: CardNumber.Ace,
};

const suitMap: { [key: string]: CardSuit } = {
  CLUB: CardSuit.Club,
  DIAMOND: CardSuit.Diamond,
  HEART: CardSuit.Heart,
  SPADE: CardSuit.Spade,
};
export const transformCards = (cardArray: CardArray): Card[] => {
  if (!cardArray) {
    return [];
  }

  const transformedCards: Card[] = cardArray.map((card) => {
    const cardRank = card?.rank || '';
    const cardSuit = card?.suit || '';

    return {
      number: rankMap[cardRank],
      suit: suitMap[cardSuit],
    };
  });

  return transformedCards;
};

export const transformResults = (dealCardsResult: DealCardsMutationResult) => ({
  transformedDeck: transformCards(dealCardsResult?.deck),
  transformedHand: transformCards(dealCardsResult?.dealtCards),
});
