import { FC } from 'react';
import '../../assets/font/font.css';

interface CountBoxProps {
  countLeft: number;
  displayText: 'Cards Left' | 'Aces Left';
}

interface CardsCounterProps {
  cardsLeft: number;
  acesLeft: number;
}

const CountBox: FC<CountBoxProps> = ({ countLeft, displayText }) => {
  return (
    <div className="w-180 bg-black border border-solid border-yellow-300 p-4 courier-prime-regular">
      <p
        data-testid={displayText}
        className="text-white font-family-courier-prime text-4xl font-bold leading-5 text-center mt-2"
      >
        {countLeft}
      </p>
      <p className="text-white font-family-courier-prime text-lg font-bold leading-6 text-center mt-2">
        {displayText}
      </p>
    </div>
  );
};

const CardsCounter: FC<CardsCounterProps> = ({ cardsLeft, acesLeft }) => {
  return (
    <div className="flex items-center justify-center">
      <CountBox countLeft={cardsLeft} displayText="Cards Left" />
      <CountBox countLeft={acesLeft} displayText="Aces Left" />
    </div>
  );
};

export default CardsCounter;
