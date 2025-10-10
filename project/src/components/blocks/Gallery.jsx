import React from 'react';
import './Gallery.css';

export default function Gallery({ data }) {
  const { heading, items } = data;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="gallery section">
      <div className="container">
        {heading && <h2 className="gallery-heading">{heading}</h2>}
        <div className="gallery-grid">
          {items.map((item, index) => (
            <div key={index} className="gallery-item">
              <div className="gallery-item-image-wrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  className="gallery-item-image"
                />
              </div>
              <div className="gallery-item-content">
                <h3 className="gallery-item-title">{item.title}</h3>
                <p className="gallery-item-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
