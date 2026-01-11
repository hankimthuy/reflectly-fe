import React from 'react';
import './Loading.scss';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullHeight?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 'medium',
  fullHeight = false,
  className = ''
}) => {
  return (
    <div 
      className={`loading-container ${size} ${fullHeight ? 'full-height' : ''} ${className}`}
    >
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <div className="loading-message">{message}</div>
    </div>
  );
};

export default Loading;