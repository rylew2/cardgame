import React from 'react';
import '../../assets/font/font.css';

interface PlayAgainButtonProps {
  onClick?: () => void;
}

const PlayAgainButton: React.FC<PlayAgainButtonProps> = ({ onClick }) => {
  return (
    <div className="row-span-1 flex items-start justify-center mt-16">
      <button
        type="button"
        className="bg-transparent courier-prime-regular border-2 border-cardgameYellow px-2 py-2 rounded-xl text-cardgameYellow font-bold text-2xl w-60"
        onClick={onClick}
      >
        Play Again
      </button>
    </div>
  );
};

export default PlayAgainButton;
