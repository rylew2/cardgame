import React from 'react';
import styles from '../../App.module.css';
import { Card } from '../../common/cardUtil';
import PlayAgainButton from '../button/PlayAgainButton';
import CardsHand from '../card/CardsHand';
import CardsCounter from '../counter/CardsCounter';
import GameConfetti from './GameConfetti';
import WinnerBanner from './WinnerBanner';
import './gameGrid.css';

interface GameWonProps {
  hand: Card[];
  handKey: number;
  cardsLeft: number;
  acesLeft: number;
  handleReset: () => void;
}

const GameWon: React.FC<GameWonProps> = ({ hand, handKey, cardsLeft, acesLeft, handleReset }) => {
  return (
    <>
      <div className={`${styles.body} game-grid ${styles.bgGradientCustom}`}>
        <CardsCounter cardsLeft={cardsLeft} acesLeft={acesLeft} />
        <CardsHand key={handKey} hand={hand} />
        <PlayAgainButton onClick={handleReset} />
      </div>
      <WinnerBanner />
      <GameConfetti />
    </>
  );
};

export default GameWon;
