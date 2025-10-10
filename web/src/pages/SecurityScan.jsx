import React from 'react'
import { SecurityScanForm } from '../ui/forms/SecurityScanForm.jsx'

export default function SecurityScan(){
  return (
    <section className="container">
      <h1>AI Tool Security Scan</h1>
      <p>Provide <strong>Tool name</strong> or <strong>Target URL</strong> (at least one required).</p>
      <SecurityScanForm />
      <p className="muted small">We do not perform intrusive tests without explicit written consent and defined scope.</p>
    </section>
  )
}
