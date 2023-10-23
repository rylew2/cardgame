import React from 'react';
import '../../assets/font/font.css';

interface ResetButtonProps {
  onClick?: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onClick }) => {
  return (
    <div className="row-span-1 flex alfa-slab-one-regular items-center justify-end pr-20">
      <button
        type="button"
        className="bg-transparent border-2 border-cardgameYellow alfa-slab-one tracking-wider px-2 py-2 rounded-xl text-cardgameYellow w-36 text-2xl"
        onClick={onClick}
      >
        Reset
      </button>
    </div>
  );
};

export default ResetButton;
