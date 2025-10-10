import React from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function SecurityScanForm(){
  const [state, set] = React.useState({
    name:'', company:'', email:'', phone:'', message:'',
    tool_name:'', target_url:'', environment:'', urgency:'',
    consent:false, privacy:false
  })
  const [done, setDone] = React.useState(false)
  const [err, setErr] = React.useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setErr(null)
    const res = await fetch(`${API}/api/forms/security-scan`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(state)
    })
    if(res.ok){ setDone(true) } else {
      const data = await res.json().catch(()=>({}))
      setErr(data.error || 'Submission failed')
    }
  }

  if(done) return <div className="alert">Thanks! Your scan request is in.</div>

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
      <div className="row">
        <fieldset><label>Tool name (optional)</label><input value={state.tool_name} onChange={e=>set(s=>({...s, tool_name:e.target.value}))} /></fieldset>
        <fieldset><label>Target URL (optional)</label><input type="url" placeholder="https://..." value={state.target_url} onChange={e=>set(s=>({...s, target_url:e.target.value}))} /></fieldset>
      </div>
      <div className="row">
        <fieldset>
          <label>Environment</label>
          <select value={state.environment} onChange={e=>set(s=>({...s, environment:e.target.value}))}>
            <option value="">Select</option>
            <option>Production</option>
            <option>Staging</option>
            <option>Test/Dev</option>
          </select>
        </fieldset>
        <fieldset>
          <label>Urgency</label>
          <select value={state.urgency} onChange={e=>set(s=>({...s, urgency:e.target.value}))}>
            <option value="">Select</option>
            <option>Laag</option>
            <option>Normaal</option>
            <option>Hoog</option>
          </select>
        </fieldset>
      </div>
      <fieldset><label>Extra details (optional)</label><textarea value={state.message} onChange={e=>set(s=>({...s, message:e.target.value}))} /></fieldset>
      <div className="row">
        <label><input type="checkbox" required checked={state.consent} onChange={e=>set(s=>({...s, consent:e.target.checked}))} /> I am authorized and accept the terms.</label>
        <label><input type="checkbox" required checked={state.privacy} onChange={e=>set(s=>({...s, privacy:e.target.checked}))} /> I agree with the privacy policy.</label>
      </div>
      <button className="btn" type="submit">Request scan</button>
      <p className="muted">You must provide at least a Tool name or a Target URL.</p>
    </form>
  )
}
