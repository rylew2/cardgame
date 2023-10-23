export enum CardNumber {
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
  Ace = 'A',
}

export enum CardSuit {
  Heart = 'heart',
  Diamond = 'diamond',
  Club = 'club',
  Spade = 'spade',
}

export interface Card {
  number: CardNumber;
  suit: CardSuit;
}

export const getInitialDeck = (): Card[] => {
  const initialDeck: Card[] = [];
  Object.values(CardSuit).forEach((suit) => {
    Object.values(CardNumber).forEach((number) => {
      const card: Card = {
        number,
        suit,
      };
      initialDeck.push(card);
    });
  });
  return initialDeck;
};

// generate a random number between -.5 and .5 at
// each sort comparison, resulting in swaps to random idx
const shuffleCards = (deck: Card[]): Card[] => {
  return [...deck].sort(() => 0.5 - Math.random());
};

export const getRandomCards = (
  deck: Card[],
  count: number
): { randomHand: Card[]; updatedDeck: Card[] } => {
  const shuffledDeck = shuffleCards(deck);
  const randomHand = shuffledDeck.slice(0, count);
  const updatedDeck = shuffledDeck.slice(count);
  return { randomHand, updatedDeck };
};

export const getAcesInHand = (hand: Card[]): number => {
  const aces = hand.filter((card) => card.number === CardNumber.Ace);
  return aces.length;
};
