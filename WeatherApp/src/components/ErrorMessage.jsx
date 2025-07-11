import React from 'react';

const ErrorMessage = ({ error, onRetry }) => (
  <div className="error-container">
    <p className="error-message">⚠️ {error}</p>
    <button onClick={onRetry} className="retry-btn">
      Try Again
    </button>
  </div>
);

export default ErrorMessage;