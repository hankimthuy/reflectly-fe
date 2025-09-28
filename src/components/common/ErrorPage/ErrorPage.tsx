import React from 'react';
import './ErrorPage.scss';

interface ErrorPageProps {
  title: string;
  message: string;
  tip: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  title,
  message,
  tip
}) => {
  return (
    <div className="error-page">
      <div className="error-container">
        <h2 className="error-title">{title}</h2>
        <p className="error-message">{message}</p>
        <div className="error-tip">{tip}</div>
      </div>
    </div>
  );
};

export default ErrorPage;
