import React from 'react';
import './Hero.css';

export default function Hero({ data }) {
  const { heading, subheading, description, ctaText, ctaLink, backgroundImage } = data;

  const handleCTAClick = (e) => {
    if (ctaLink?.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(ctaLink);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section className="hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="hero-overlay">
        <div className="container">
          <div className="hero-content">
            <div className="hero-logo-container">
              <img
                src="/AI-GE logo.svg"
                alt="AI Global Experts"
                className="hero-logo"
              />
            </div>
            {heading && <h1 className="hero-heading">{heading}</h1>}
            {subheading && <p className="hero-subheading">{subheading}</p>}
            {description && <p className="hero-description">{description}</p>}
            {ctaText && ctaLink && (
              <a href={ctaLink} className="hero-cta" onClick={handleCTAClick}>
                {ctaText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
