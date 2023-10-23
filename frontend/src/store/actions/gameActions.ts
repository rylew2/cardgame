import { createAction } from '@reduxjs/toolkit';
import { transformResults } from '../../common/cardTransformUtil';
import { DealCardsMutationResult } from '../../graphql/graphqlService';
import { GameState } from '../types';

export const setInitializedState = createAction<GameState>('game/setInitializedState');

export const dealAction = createAction(
  'game/deal',
  function prepare(dealCardsResult: DealCardsMutationResult) {
    const { transformedDeck, transformedHand } = transformResults(dealCardsResult);

    return {
      payload: {
        hand: transformedHand,
        deck: transformedDeck,
      },
    };
  }
);

export const resetAction = createAction(
  'game/reset',
  function prepare(dealCardsResult: DealCardsMutationResult) {
    const { transformedDeck, transformedHand } = transformResults(dealCardsResult);

    return {
      payload: {
        hand: transformedHand,
        deck: transformedDeck,
      },
    };
  }
);
