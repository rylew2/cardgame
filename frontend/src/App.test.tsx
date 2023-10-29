import { screen, waitFor } from '@testing-library/react';
import App from './App';
import { Card, CardNumber, CardSuit } from './common/cardUtil';
import { GamePhase } from './common/gameutil';
import { renderWithProviders } from './utils/test-utils';

const nullMock = () => null;
jest.mock('./components/gamePhase/GameConfetti', () => nullMock);

describe('App', () => {
  const getDealButton = () => screen.queryByText('DEAL');
  const getResetButton = () => screen.queryByText('Reset');
  const getPlayAgainButton = () => screen.queryByText('Play Again');

  const clickDealButton = () => {
    const dealButton = getDealButton();
    if (dealButton) {
      dealButton.click();
    }
  };

  const clickResetButton = () => {
    const resetButton = getResetButton();
    if (resetButton) {
      resetButton.click();
    }
  };

  const clickPlayAgainButton = () => {
    const playAgainButton = getPlayAgainButton();
    if (playAgainButton) {
      playAgainButton.click();
    }
  };

  const expectDealButtonOnScreen = () => {
    const dealButton = getDealButton();
    expect(dealButton).toBeInTheDocument();
  };

  const expectResetButtonOnScreen = () => {
    const resetButton = getResetButton();
    expect(resetButton).toBeInTheDocument();
  };

  const expectPlayAgainButtonOnScreen = () => {
    const playAgainButton = getPlayAgainButton();
    expect(playAgainButton).toBeInTheDocument();
  };

  const getCardsLeftCountByText = (text: 'Cards Left' | 'Aces Left') => {
    const element = screen.getByTestId(text);
    const textContent = element?.textContent ?? '';
    return parseInt(textContent, 10);
  };

  const expectCardsLeftOnScreen = (cardsLeft: number) => {
    const cardsLeftCount = getCardsLeftCountByText('Cards Left');
    const cardsLeftText = screen.getByText('Cards Left');
    expect(cardsLeftCount).toBe(cardsLeft);
    expect(cardsLeftText).toBeInTheDocument();

    const acesLeftText = screen.getByText('Aces Left');
    expect(acesLeftText).toBeInTheDocument();
  };

  describe('Core components on screen', () => {
    describe('buttons', () => {
      test('initial state buttons', () => {
        renderWithProviders(<App />);

        expectDealButtonOnScreen();
        expectResetButtonOnScreen();
        expect(getPlayAgainButton()).not.toBeInTheDocument();
      });
    });

    describe('playing hand', () => {
      test('standard 5 card hand showing', () => {
        const { container } = renderWithProviders(<App />);
        const cards = container.querySelectorAll('[class^="card-"]');
        expect(cards.length).toBe(5);
      });
    });

    describe('cards left', () => {
      test('standard cards left showing', () => {
        renderWithProviders(<App />);

        expectCardsLeftOnScreen(47);

        // Can have 4,3,2,1, or 0 aces left depending on initial hand
        const acesLeftCountRegex = /[43210]$/;
        const acesLeftMatch = screen.queryAllByText(acesLeftCountRegex);
        expect(acesLeftMatch.length).toBeGreaterThan(0);
      });

      test('overridden initial state', () => {
        const preloadedState = {
          game: {
            deck: [],
            hand: [],
            cardsLeft: 30,
            acesLeft: 1,
            gamePhase: GamePhase.InProgress,
          },
        };

        renderWithProviders(<App />, {
          preloadedState,
        });

        expect(screen.getByText('30')).toBeInTheDocument();
        expect(screen.getByText('Cards Left')).toBeInTheDocument();

        expect(screen.getByText('Aces Left')).toBeInTheDocument();

        const acesLeftCountRegex = /1$/;
        const acesLeftMatch = screen.queryAllByText(acesLeftCountRegex);
        expect(acesLeftMatch.length).toBeGreaterThan(0);
      });
    });
  });

  describe('gameplay', () => {
    const getCurrentHandOnScreen = (count: number) => {
      const currentHandOnScreen = [];
      let suit;
      let suitParent;
      let number;
      for (let i = 0; i < count; i++) {
        suitParent = screen.getByTestId(`card-suit-${i}`);
        suit = suitParent.getAttribute('alt');
        number = screen.getByTestId(`card-number-${i}`).textContent;
        currentHandOnScreen.push({ suit, number });
      }
      return currentHandOnScreen;
    };

    const areHandsDistinct = (hand1: Card[], hand2: Card[]) => {
      const allCards = [...hand1, ...hand2];
      const duplicates = allCards.filter(
        (card, index) =>
          allCards.findIndex((c) => c.suit === card.suit && c.number === card.number) !== index
      );
      return duplicates.length === 0;
    };

    test('deal a new distinct hand', async () => {
      renderWithProviders(<App />);

      const firstHand = getCurrentHandOnScreen(5);
      expectCardsLeftOnScreen(47);
      await waitFor(() => {
        clickDealButton();
      });
      const secondHand = getCurrentHandOnScreen(5);
      expect(areHandsDistinct(firstHand as Card[], secondHand as Card[])).toBe(true);
    });

    test('reset game', async () => {
      renderWithProviders(<App />);

      expect(getCardsLeftCountByText('Cards Left')).toBe(47);
      await waitFor(() => {
        clickDealButton();
        expect(getCardsLeftCountByText('Cards Left')).toBe(42);
        clickResetButton();
      });
      expect(getCardsLeftCountByText('Cards Left')).toBe(47);
    });

    test('play again', async () => {
      const card1: Card = { number: CardNumber.Three, suit: CardSuit.Heart };
      const card2: Card = { number: CardNumber.Two, suit: CardSuit.Spade };
      const preloadedState = {
        game: {
          deck: [],
          hand: [card1, card2],
          cardsLeft: 0,
          acesLeft: 0,
          gamePhase: GamePhase.Won,
        },
      };

      renderWithProviders(<App />, {
        preloadedState,
      });

      expect(getCardsLeftCountByText('Cards Left')).toBe(0);
      await waitFor(() => {
        clickPlayAgainButton();
      });
      expect(getCardsLeftCountByText('Cards Left')).toBe(47);
    });

    test('max deals to completion', async () => {
      renderWithProviders(<App />);

      let cardsLeftInDeck = getCardsLeftCountByText('Cards Left');
      let acesLeftInDeck = getCardsLeftCountByText('Aces Left');
      let dealCount = 0;

      while (acesLeftInDeck > 0 && cardsLeftInDeck > 0 && getDealButton()) {
        // eslint-disable-next-line no-await-in-loop
        await waitFor(() => {
          clickDealButton();
        });
        dealCount += 1;
        cardsLeftInDeck = getCardsLeftCountByText('Cards Left');
        acesLeftInDeck = getCardsLeftCountByText('Aces Left');
      }

      expect(dealCount).toBeLessThanOrEqual(10);
    });

    test('game won', () => {
      const card1: Card = { number: CardNumber.Ace, suit: CardSuit.Heart };
      const card2: Card = { number: CardNumber.Two, suit: CardSuit.Spade };
      const preloadedState = {
        game: {
          deck: [],
          hand: [card1, card2],
          cardsLeft: 0,
          acesLeft: 0,
          gamePhase: GamePhase.Won,
        },
      };

      renderWithProviders(<App />, {
        preloadedState,
      });

      expect(screen.getByAltText('Winner')).toBeInTheDocument();
      expectPlayAgainButtonOnScreen();
      expect(getDealButton()).not.toBeInTheDocument();
      expect(getResetButton()).not.toBeInTheDocument();
    });

    test('game lost', () => {
      const card1: Card = { number: CardNumber.Ace, suit: CardSuit.Heart };
      const card2: Card = { number: CardNumber.Two, suit: CardSuit.Spade };
      const preloadedState = {
        game: {
          deck: [],
          hand: [card1, card2],
          cardsLeft: 0,
          acesLeft: 0,
          gamePhase: GamePhase.Lost,
        },
      };

      renderWithProviders(<App />, {
        preloadedState,
      });

      expectPlayAgainButtonOnScreen();
      expect(getDealButton()).not.toBeInTheDocument();
      expect(getResetButton()).not.toBeInTheDocument();
    });
  });
});
