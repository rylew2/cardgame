import React from 'react';
import styles from '../../App.module.css';
import { Card } from '../../common/cardUtil';
import PlayAgainButton from '../button/PlayAgainButton';
import CardsHand from '../card/CardsHand';
import CardsCounter from '../counter/CardsCounter';
import LostText from '../text/LostText';
import './gameGrid.css';

interface GameLostProps {
  hand: Card[];
  handKey: number;
  cardsLeft: number;
  acesLeft: number;
  handleReset: () => void;
}

const GameLost: React.FC<GameLostProps> = ({ hand, handKey, cardsLeft, acesLeft, handleReset }) => {
  return (
    <>
      <div className={`${styles.body} game-grid ${styles.bgGradientCustom}`}>
        <CardsCounter cardsLeft={cardsLeft} acesLeft={acesLeft} />
        <CardsHand key={handKey} hand={hand} />
        <LostText />
        <PlayAgainButton onClick={handleReset} />
      </div>
    </>
  );
};

export default GameLost;
