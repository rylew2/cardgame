import { useCallback, useEffect, useState } from 'react';
import GameInProgress from './components/gamePhase/GameInProgress';
import GameLoading from './components/gamePhase/GameLoading';
import GameLost from './components/gamePhase/GameLost';
import GameWon from './components/gamePhase/GameWon';
import GraphQLService from './graphql/graphqlService';
import { dealAction, resetAction } from './store/actions/gameActions';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  selectAcesLeft,
  selectCardsLeft,
  selectHand,
  selectGamePhase,
} from './store/slices/gameSlice';
import { initializeGame } from './store/slices/initializeGameSlice';
import { GamePhase } from './store/types';

function App() {
  const dispatch = useAppDispatch();
  const { dealCardsMutation, resetMutation } = GraphQLService();

  useEffect(() => {
    const initialize = async () => {
      await resetMutation();
      const dealCardsResult = await dealCardsMutation(5);
      initializeGame(dispatch, dealCardsResult);
    };
    initialize();
  }, []);

  const [handKey, setHandKey] = useState(0);
  const hand = useAppSelector(selectHand);
  const cardsLeft = useAppSelector(selectCardsLeft);
  const acesLeft = useAppSelector(selectAcesLeft);
  const gamePhase = useAppSelector(selectGamePhase);

  const handleDeal = useCallback(async () => {
    const numCardsToPull = cardsLeft >= 5 ? 5 : cardsLeft;
    const dealCardsResult = await dealCardsMutation(numCardsToPull);
    dispatch(dealAction(dealCardsResult));
    setHandKey((prevKey) => prevKey + 1);
  }, [hand, handKey, cardsLeft, acesLeft, gamePhase]);

  const handleReset = useCallback(async () => {
    await resetMutation();
    const dealCardsResult = await dealCardsMutation(5);
    dispatch(resetAction(dealCardsResult));
    setHandKey((prevKey) => prevKey + 1);
  }, [hand, handKey, cardsLeft, acesLeft, gamePhase]);

  const getGamePhaseToDisplay = () => {
    const commonProps = {
      hand,
      handKey,
      cardsLeft,
      acesLeft,
      handleReset,
    };

    switch (gamePhase) {
      case GamePhase.Loading:
        return <GameLoading />;
      case GamePhase.Won:
        return <GameWon {...commonProps} />;
      case GamePhase.Lost:
        return <GameLost {...commonProps} />;
      case GamePhase.InProgress:
        return <GameInProgress {...commonProps} handleDeal={handleDeal} />;
      default:
        return <GameLoading />;
    }
  };

  return getGamePhaseToDisplay();
}

export default App;
