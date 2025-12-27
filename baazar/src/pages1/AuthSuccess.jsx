// src/pages/AuthSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../services/api';
import { useUser } from '../context/UserContext';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    let mounted = true;
    async function fetchMe() {
      try {
        const res = await apiFetch('/api/auth/me');
        if (mounted && res?.user) setUser(res.user);
      } catch (err) {
        // ignore
      } finally {
        if (mounted) navigate('/');
      }
    }
    fetchMe();
    return () => { mounted = false; };
  }, [navigate, setUser]);

  return <div style={{ padding: 20 }}>Authentication successful. Redirecting…</div>;
}
