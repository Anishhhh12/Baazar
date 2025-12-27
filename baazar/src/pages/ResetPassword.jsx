// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiFetch from '../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      await apiFetch(`/api/auth/reset/${token}`, { method: 'POST', body: { password } });
      setMsg('Password reset successful — redirecting to login');
      setTimeout(() => navigate('/login'), 1400);
    } catch (err) {
      setMsg(err?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 20 }}>
      <h2>Reset Password</h2>
      {msg && <div style={{ marginBottom: 10 }}>{msg}</div>}
      <form onSubmit={onSubmit}>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" required />
        <button type="submit" disabled={loading}>{loading ? 'Resetting…' : 'Reset password'}</button>
      </form>
    </div>
  );
}
