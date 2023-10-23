import React from 'react';
import styles from '../../App.module.css';
import LoadingSvg from '../../assets/loading.svg';

import './gameGrid.css';

const GameLost: React.FC = () => {
  return (
    <>
      <div className={`${styles.body} game-grid ${styles.bgGradientCustom}`}>
        <div className="flex justify-center items-center">
          <img src={LoadingSvg} alt="loading" />
        </div>
      </div>
    </>
  );
};

export default GameLost;
