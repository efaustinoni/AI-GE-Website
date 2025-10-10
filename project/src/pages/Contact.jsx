import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import './Form.css';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
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
            kind: 'contact',
            name: formData.name,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
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
          <h1>Contact</h1>
          <p>Neem contact met ons op voor vragen of een vrijblijvend gesprek.</p>
        </div>

        {success ? (
          <div className="success-message">
            <h2>Bedankt voor uw bericht!</h2>
            <p>We nemen zo spoedig mogelijk contact met u op.</p>
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
              <label htmlFor="message">Bericht</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="button-primary"
              disabled={submitting}
            >
              {submitting ? 'Verzenden...' : 'Verstuur Bericht'}
            </button>
          </form>
        )}
        </div>
      </div>
    </>
  );
}
