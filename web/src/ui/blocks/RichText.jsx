import React from 'react'
export function RichText({ html, variant='standard' }){
  return (
    <section className={`card var-${variant}`} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
