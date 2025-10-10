import React from 'react'
export function Hero({ heading, sub, ctaLabel, ctaLink, variant='standard' }){
  return (
    <section className={`card hero var-${variant}`}>
      <h1>{heading}</h1>
      {sub && <p className="muted">{sub}</p>}
      {ctaLabel && ctaLink && <a className="btn" href={ctaLink}>{ctaLabel}</a>}
    </section>
  )
}
