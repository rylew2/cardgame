import { FC } from 'react';
import CloverSvg from '../../assets/Clover.svg';
import DiamondSvg from '../../assets/Diamond.svg';
import HeartSvg from '../../assets/Heart.svg';
import SpadeSvg from '../../assets/Spade.svg';
import { CardNumber, CardSuit } from '../../common/cardUtil';
import '../../assets/font/font.css';

interface CardProps {
  number: CardNumber;
  suit: CardSuit;
  index: string | null;
}

const Card: FC<CardProps> = ({ number, suit, index }) => {
  let suitSvg = null;

  switch (suit) {
    case CardSuit.Club:
      suitSvg = CloverSvg;
      break;
    case CardSuit.Diamond:
      suitSvg = DiamondSvg;
      break;
    case CardSuit.Heart:
      suitSvg = HeartSvg;
      break;
    case CardSuit.Spade:
      suitSvg = SpadeSvg;
      break;
    default:
      suitSvg = HeartSvg;
  }

  return (
    <div className={`card-animation-${index} bg-white p-6 rounded-3xl w-52 flex flex-col`}>
      <div className="flex justify-left text-8xl font-bold">
        <div data-testid={`card-number-${index}`} className="courier-prime-regular">
          {number}
        </div>
      </div>
      <div className="flex justify-start items-start space-y-4  mt-4">
        <img src={suitSvg} alt={suit} className="w-1/3" />
      </div>
      <div className="flex justify-end mt-5">
        <img data-testid={`card-suit-${index}`} src={suitSvg} alt={suit} />
      </div>
    </div>
  );
};

export default Card;
