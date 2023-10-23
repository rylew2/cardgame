import React from 'react';
import styles from '../../App.module.css';
import { Card } from '../../common/cardUtil';
import DealButton from '../button/DealButton';
import ResetButton from '../button/ResetButton';
import CardsHand from '../card/CardsHand';
import CardsCounter from '../counter/CardsCounter';
import './gameGrid.css';

interface GameInProgressProps {
  hand: Card[];
  handKey: number;
  cardsLeft: number;
  acesLeft: number;
  handleDeal: () => void;
  handleReset: () => void;
}

const GameInProgress: React.FC<GameInProgressProps> = ({
  hand,
  handKey,
  cardsLeft,
  acesLeft,
  handleDeal,
  handleReset,
}) => {
  return (
    <div className={`${styles.body} game-grid ${styles.bgGradientCustom}`}>
      <CardsCounter cardsLeft={cardsLeft} acesLeft={acesLeft} />
      <CardsHand key={handKey} hand={hand} />
      <DealButton onClick={handleDeal} />
      <ResetButton onClick={handleReset} />
    </div>
  );
};

export default GameInProgress;
