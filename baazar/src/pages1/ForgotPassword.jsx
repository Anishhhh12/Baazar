// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import apiFetch from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/forgot', { method: 'POST', body: { email } });
      setMsg(res.message || 'If that email exists, a reset link has been sent');
    } catch (err) {
      setMsg('If that email exists, a reset link has been sent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 20 }}>
      <h2>Forgot Password</h2>
      {msg && <div style={{ marginBottom: 10 }}>{msg}</div>}
      <form onSubmit={onSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <button type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
      </form>
    </div>
  );
}
