import React from 'react'
import { Hero } from './blocks/Hero.jsx'
import { RichText } from './blocks/RichText.jsx'
import { Video } from './blocks/Video.jsx'
import { Gallery } from './blocks/Gallery.jsx'
import { FormCTA } from './blocks/FormCTA.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function Blocks({ slug }){
  const [page, setPage] = React.useState(null)
  const [error, setError] = React.useState(null)

  React.useEffect(()=>{
    let cancelled = false
    fetch(`${API}/api/pages/${slug}`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => { if(!cancelled) setPage(data) })
      .catch(async (e)=>{
        let msg = e.status ? `${e.status} ${e.statusText}` : e.message
        if(!cancelled) setError(msg)
      })
    return ()=>{ cancelled = true }
  }, [slug])

  if(error) return <section className="container"><div className="alert">Error loading page: {String(error)}</div></section>
  if(!page) return <section className="container"><div className="alert">Loading…</div></section>

  return (
    <article className="container grid">
      {page.blocks.map((b, i) => {
        const v = b.data.variant || 'standard'
        switch(b.type){
          case 'hero': return <Hero key={i} {...b.data} variant={v} />
          case 'richtext': return <RichText key={i} {...b.data} variant={v} />
          case 'video': return <Video key={i} {...b.data} variant={v} />
          case 'gallery': return <Gallery key={i} {...b.data} variant={v} />
          case 'form_cta': return <FormCTA key={i} {...b.data} variant={v} />
          default: return <div key={i} className="card">Unknown block: {b.type}</div>
        }
      })}
    </article>
  )
}
