import React from 'react';

export default function LoadingSpinner({ message = 'Loading student records...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}
