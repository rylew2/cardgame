import React from 'react';
import '../../assets/font/font.css';

interface DealButtonProps {
  onClick?: () => void;
}

const DealButton: React.FC<DealButtonProps> = ({ onClick }) => {
  return (
    <div className="row-span-1 flex items-center justify-center">
      <button
        type="button"
        className="bg-cardgameYellow w-[22rem] px-10 py-4 rounded-xl text-black alfa-slab-one-regular tracking-wider font-bold text-6xl"
        onClick={onClick}
      >
        DEAL
      </button>
    </div>
  );
};

export default DealButton;
