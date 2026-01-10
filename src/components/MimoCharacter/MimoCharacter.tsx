import React from 'react';
import './MimoCharacter.scss';
import { LuActivity } from 'react-icons/lu';

interface MimoCharacterProps {
  theme?: 'bridge' | 'inner' | 'outer';
  className?: string;
}

const MimoCharacter = ({ theme = 'bridge', className = '' }: MimoCharacterProps) => {
  return (
    <div className={`mimo-character ${className}`}>
      
    </div>
  );
};

export default MimoCharacter;