import React from 'react'
export function Video({ url, poster, variant='standard' }){
  const isExternal = (url||'').includes('youtube.com') || (url||'').includes('youtu.be') || (url||'').includes('vimeo.com')
  return (
    <section className={`card var-${variant}`}>
      <div className="responsive-embed">
        {isExternal ? (
          <iframe src={url} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <video controls poster={poster || undefined}>
            <source src={url} type="video/mp4" />
          </video>
        )}
      </div>
    </section>
  )
}
