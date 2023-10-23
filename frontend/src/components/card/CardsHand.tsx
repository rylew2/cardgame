import { FC } from 'react';
import { Card as CardData } from '../../common/cardUtil';
import Card from './Card';
import './cards-animation.css';

interface CardsHandProps {
  hand: CardData[];
}

const CardsHand: FC<CardsHandProps> = ({ hand }) => {
  const getCardProps = (card: CardData, idx: number) => {
    const cardProps = {
      number: card.number,
      suit: card.suit,
      index: hand.length >= 5 ? idx.toString() : null,
    };

    return cardProps;
  };

  return (
    <div className="row-span-1 flex items-center justify-center">
      <div className="flex gap-8 justify-center flex-wrap">
        {hand?.map((card, idx) => {
          return <Card key={idx} {...getCardProps(card, idx)} />;
        })}
      </div>
    </div>
  );
};

export default CardsHand;
