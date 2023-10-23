import { Dispatch } from '@reduxjs/toolkit';
import { transformResults } from '../../common/cardTransformUtil';
import { getAcesInHand } from '../../common/cardUtil';
import { DealCardsMutationResult } from '../../graphql/graphqlService';
import { GamePhase, GameState } from '../types';
import { setGameState } from './gameSlice';

export const initializeGame = async (
  dispatch: Dispatch,
  dealCardsResult: DealCardsMutationResult
) => {
  try {
    const { transformedDeck, transformedHand } = transformResults(dealCardsResult);
    const initializedState: GameState = {
      deck: transformedDeck,
      hand: transformedHand,
      acesLeft: 4 - getAcesInHand(transformedHand),
      cardsLeft: 47,
      gamePhase: GamePhase.InProgress,
    };
    dispatch(setGameState(initializedState));
  } catch (error) {
    console.error('Error while initializing game state:', error);
  }
};
