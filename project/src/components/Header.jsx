import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="header-container">
        <button
          onClick={() => navigate('/')}
          className="logo-button"
          aria-label="Go to homepage"
        >
          <img
            src="/AI Global Experts Logo Design.png"
            alt="AI Global Experts"
            className="logo"
          />
        </button>

        {location.pathname !== '/' && (
          <button onClick={() => navigate('/')} className="back-link">
            ← Back to Home
          </button>
        )}
      </div>
    </header>
  );
}
