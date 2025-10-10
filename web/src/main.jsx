import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'

import Home from './pages/Home.jsx'
import Contact from './pages/Contact.jsx'
import SecurityScan from './pages/SecurityScan.jsx'
import Page from './pages/Page.jsx'

function Shell({ children }){
  const toggle = () => {
    const root = document.documentElement
    const cur = root.getAttribute('data-theme') || 'light'
    root.setAttribute('data-theme', cur === 'light' ? 'dark' : 'light')
    try{ localStorage.setItem('site-theme', root.getAttribute('data-theme')) }catch(e){}
  }
  React.useEffect(()=>{
    const saved = localStorage.getItem('site-theme')
    if(saved) document.documentElement.setAttribute('data-theme', saved)
  },[])
  return (
    <>
      <header>
        <div className="container nav">
          <Link className="brand" to="/">AI Global Experts</Link>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/security-scan">Security Scan</Link>
            <Link to="/contact" className="btn">Contact</Link>
            <button className="btn" onClick={toggle}>☾</button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer>
        <div className="container">
          <small>© {new Date().getFullYear()} AI Global Experts — <Link to="/privacy">Privacy</Link></small>
        </div>
      </footer>
    </>
  )
}

function App(){
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/security-scan" element={<SecurityScan />} />
          <Route path="/:slug" element={<Page />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
