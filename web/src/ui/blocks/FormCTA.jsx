import React from 'react'
import { ContactForm } from '../forms/ContactForm.jsx'
import { SecurityScanForm } from '../forms/SecurityScanForm.jsx'

export function FormCTA({ title, text, formKey='contact', variant='standard' }){
  return (
    <section className={`card var-${variant}`}>
      {title && <h2>{title}</h2>}
      {text && <p>{text}</p>}
      {formKey === 'contact' ? <ContactForm /> : <SecurityScanForm />}
    </section>
  )
}
