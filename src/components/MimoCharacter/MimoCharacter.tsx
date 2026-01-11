import React from 'react';
import './MimoCharacter.scss';
import mimoImage from '../../assets/mimo.gif';

interface MimoCharacterProps {
  theme?: 'bridge' | 'inner' | 'outer';
  className?: string;
}

const MimoCharacter = ({ theme = 'bridge', className = '' }: MimoCharacterProps) => {
  return (
    <div className={`mimo-character ${className}`}>
      <div className={`mimo-character__body mimo-character__body--${theme}`}>
         <img 
            src={mimoImage} 
            alt="Mimo Mascot" 
            className="mimo-character__image"
         />
         
         <div className="mimo-character__glow"></div>
      </div>

      <div className="mimo-character__shadow"></div>
    </div>
  );
};

export default MimoCharacter;