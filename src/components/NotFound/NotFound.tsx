import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./NotFound.scss";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="code">404</h1>
      <h2 className="title">Page Not Found</h2>
      <p className="message">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>

      <div className="button-group">
        <button 
          onClick={() => navigate(-1)} 
          className="button secondary"
        >
          Go Back
        </button>

        <button 
          onClick={() => navigate('/')} 
          className="button primary"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;