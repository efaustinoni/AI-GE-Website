import React from 'react'
export function Gallery({ images = [], variant='standard' }){
  return (
    <section className={`card var-${variant}`}>
      <div className="grid grid-2">
        {images.map((src, i) => <figure key={i}><img src={src} alt="" /></figure>)}
      </div>
    </section>
  )
}
