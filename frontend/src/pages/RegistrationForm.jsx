import React, { useState } from 'react';

const API_URL = '/api/people';

function RegistrationForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    if (!fullName.trim()) {
      setMessage({ text: 'Full Name is required.', type: 'error' });
      return false;
    }
    if (!email.trim()) {
      setMessage({ text: 'Email is required.', type: 'error' });
      return false;
    }
    if (!emailRegex.test(email)) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName.trim(), email: email.trim() }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage({ text: `Successfully registered ${data.full_name}!`, type: 'success' });
        setFullName('');
        setEmail('');
      } else if (response.status === 409) {
        setMessage({ text: 'This email is already registered.', type: 'error' });
      } else if (response.status === 400) {
        setMessage({ text: data.error || 'Validation error.', type: 'error' });
      } else {
        setMessage({ text: 'An unexpected error occurred.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to connect to the server.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card form-card">
        <div className="card-header">
          <h1>Register a New Person</h1>
          <p className="card-subtitle">Fill out the form below to add a new person to the database.</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            <span className="alert-icon">{message.type === 'success' ? '✓' : '✕'}</span>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register Person'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
