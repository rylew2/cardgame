import React from 'react';
import winnerSvg from '../../assets/winner.svg';

const WinnerBanner = () => {
  return (
    <div className="fixed top-[12%] left-[50%] transform -translate-x-1/2 w-80vw">
      <img src={winnerSvg} alt="Winner" />
    </div>
  );
};

export default WinnerBanner;
