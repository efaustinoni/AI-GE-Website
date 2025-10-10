import React from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function ContactForm(){
  const [state, set] = React.useState({ name:'', company:'', email:'', phone:'', message:'', consent:false, privacy:false })
  const [done, setDone] = React.useState(false)
  const [err, setErr] = React.useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setErr(null)
    const res = await fetch(`${API}/api/forms/contact`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(state)
    })
    if(res.ok){ setDone(true) } else {
      const data = await res.json().catch(()=>({}))
      setErr(data.error || 'Submission failed')
    }
  }

  if(done) return <div className="alert">Thanks! We received your message.</div>

  return (
    <form className="form" onSubmit={submit}>
      {err && <div className="alert">Error: {err}</div>}
      <div className="row">
        <fieldset><label>Name</label><input required value={state.name} onChange={e=>set(s=>({...s, name:e.target.value}))} /></fieldset>
        <fieldset><label>Company (optional)</label><input value={state.company} onChange={e=>set(s=>({...s, company:e.target.value}))} /></fieldset>
      </div>
      <div className="row">
        <fieldset><label>Email</label><input type="email" required value={state.email} onChange={e=>set(s=>({...s, email:e.target.value}))} /></fieldset>
        <fieldset><label>Phone (optional)</label><input value={state.phone} onChange={e=>set(s=>({...s, phone:e.target.value}))} /></fieldset>
      </div>
      <fieldset><label>Message</label><textarea required value={state.message} onChange={e=>set(s=>({...s, message:e.target.value}))} /></fieldset>
      <div className="row">
        <label><input type="checkbox" required checked={state.consent} onChange={e=>set(s=>({...s, consent:e.target.checked}))} /> I consent to being contacted.</label>
        <label><input type="checkbox" required checked={state.privacy} onChange={e=>set(s=>({...s, privacy:e.target.checked}))} /> I agree with the privacy policy.</label>
      </div>
      <button className="btn" type="submit">Send</button>
    </form>
  )
}
