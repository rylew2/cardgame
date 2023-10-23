import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { getAcesInHand } from '../../common/cardUtil';
import type { RootState } from '../store';
import { DealAction, GamePhase, GameState, ResetAction } from '../types';

const initialState: GameState = {
  deck: [],
  hand: [],
  acesLeft: 4,
  cardsLeft: 52,
  gamePhase: GamePhase.Loading,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameState: (state: GameState, action: PayloadAction<GameState>) => {
      return action.payload;
    },
    deal: (state: GameState, action: PayloadAction<DealAction>) => {
      const { hand, deck } = action.payload;

      const acesInHand = getAcesInHand(hand);
      const stateAcesLeftInDeck = state.acesLeft - acesInHand;

      state.deck = deck;
      state.hand = hand;
      state.cardsLeft = deck.length;
      state.acesLeft -= acesInHand;

      // check for game phase change if no aces left
      if (stateAcesLeftInDeck <= 0) {
        // if aces in hand on the last deal
        if (acesInHand >= 1 && deck.length === 0) {
          state.gamePhase = GamePhase.Won;
        } else {
          state.gamePhase = GamePhase.Lost;
        }
      }
    },
    reset: (state: GameState, action: PayloadAction<ResetAction>) => {
      const { deck, hand } = action.payload;

      state.deck = deck;
      state.hand = hand;
      state.cardsLeft = 47;
      state.acesLeft = 4 - getAcesInHand(hand);
      state.gamePhase = GamePhase.InProgress;
    },
  },
});

export const selectDeck = (state: RootState) => state.game.deck;
export const selectHand = (state: RootState) => state.game.hand;
export const selectCardsLeft = (state: RootState) => state.game.cardsLeft;
export const selectAcesLeft = (state: RootState) => state.game.acesLeft;
export const selectGamePhase = (state: RootState) => state.game.gamePhase;

export const { deal, reset, setGameState } = gameSlice.actions;

export default gameSlice.reducer;
