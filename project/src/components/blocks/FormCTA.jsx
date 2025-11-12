import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FormCTA.css';

export default function FormCTA({ data }) {
  const { heading, description, formType, ctaText } = data;
  const navigate = useNavigate();

  const handleClick = () => {
    if (formType === 'contact') {
      navigate('/contact');
    } else if (formType === 'security-scan') {
      navigate('/security-scan');
    }
  };

  return (
    <section className="form-cta section" id={formType}>
      <div className="container">
        <div className="form-cta-content">
          <div className="form-cta-header-row">
            <div className="form-cta-logo-container">
              <img
                src="/AI-GE-logo-branded.svg"
                alt="AI Global Experts"
                className="form-cta-logo"
              />
            </div>
            {heading && <h2 className="form-cta-heading">{heading}</h2>}
          </div>
          {description && <p className="form-cta-description">{description}</p>}
          {ctaText && (
            <button onClick={handleClick} className="form-cta-button">
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
