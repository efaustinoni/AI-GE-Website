import React from 'react'
import { ContactForm } from '../ui/forms/ContactForm.jsx'

export default function Contact(){
  return (
    <section className="container">
      <h1>Contact</h1>
      <p>Questions or collaboration? Leave your details and we will get back to you.</p>
      <ContactForm />
    </section>
  )
}
