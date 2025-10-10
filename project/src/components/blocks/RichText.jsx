import React from 'react';
import './RichText.css';

export default function RichText({ data }) {
  const { heading, content } = data;

  return (
    <section className="richtext section">
      <div className="container">
        <div className="richtext-content">
          {heading && <h2 className="richtext-heading">{heading}</h2>}
          {content && (
            <div
              className="richtext-body"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
