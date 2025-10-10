import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import './Form.css';

export default function SecurityScan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    tool_name: '',
    target_url: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('submissions')
        .insert([
          {
            kind: 'security-scan',
            name: formData.name,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
            tool_name: formData.tool_name,
            target_url: formData.target_url,
            message: formData.message,
          },
        ]);

      if (submitError) throw submitError;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        tool_name: '',
        target_url: '',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Er is een fout opgetreden. Probeer het later opnieuw.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="form-page">
        <div className="form-container">

        <div className="form-header">
          <h1>AI Tool Security Scan Aanvraag</h1>
          <p>
            Vraag een uitgebreide security scan aan van uw AI tool. Onze experts analyseren
            uw systeem en geven gedetailleerde aanbevelingen.
          </p>
        </div>

        {success ? (
          <div className="success-message">
            <h2>Aanvraag Ontvangen!</h2>
            <p>
              Bedankt voor uw aanvraag. We nemen binnen 24 uur contact met u op om de
              security scan te bespreken.
            </p>
            <button onClick={() => navigate('/')} className="button-primary">
              Terug naar Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name">Naam *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Bedrijf</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefoonnummer</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tool_name">AI Tool Naam *</label>
              <input
                type="text"
                id="tool_name"
                name="tool_name"
                value={formData.tool_name}
                onChange={handleChange}
                placeholder="Bijvoorbeeld: ChatGPT, Custom AI Tool, etc."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="target_url">Tool URL</label>
              <input
                type="url"
                id="target_url"
                name="target_url"
                value={formData.target_url}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Aanvullende Informatie</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Beschrijf eventuele specifieke zorgen of vragen..."
              ></textarea>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="button-primary"
              disabled={submitting}
            >
              {submitting ? 'Verzenden...' : 'Aanvraag Indienen'}
            </button>
          </form>
        )}
        </div>
      </div>
    </>
  );
}
