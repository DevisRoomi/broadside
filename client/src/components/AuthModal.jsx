import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, authError, setAuthError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setAuthError(null);

    let res;
    if (isRegister) {
      res = await register(name, email, password, bio);
    } else {
      res = await login(email, password);
    }

    setSubmitting(false);
    if (res.success) {
      onClose();
    }
  }

  function fillDemo(demoEmail, demoPass) {
    setIsRegister(false);
    setEmail(demoEmail);
    setPassword(demoPass);
  }

  return (
    <div className="editorial-modal-backdrop">
      <div className="editorial-modal-window">
        <div className="modal-header-row">
          <h2 className="modal-title">
            {isRegister ? 'REGISTER NEW CORRESPONDENT' : 'CORRESPONDENT AUTHENTICATION'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {authError && (
          <div
            style={{
              background: '#ffebe8',
              border: '2px solid #a30000',
              padding: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: '#a30000',
              marginBottom: '16px',
            }}
          >
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">FULL NAME / BYLINE</label>
              <input
                type="text"
                className="form-input"
                placeholder="E.G. ARTHUR PENHALIGON"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">EDITORIAL EMAIL</label>
            <input
              type="email"
              className="form-input"
              placeholder="author@broadside.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label className="form-label">CORRESPONDENT BIO / DESK NOTE</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '80px' }}
                placeholder="Field of focus, architectural beat, or short bio..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button type="submit" className="broadside-btn" disabled={submitting}>
              {submitting ? 'VERIFYING CREDENTIALS...' : isRegister ? 'CONFIRM REGISTRATION' : 'SIGN IN TO DISPATCH DESK'}
            </button>

            <button
              type="button"
              className="broadside-btn broadside-btn-secondary"
              onClick={() => {
                setIsRegister(!isRegister);
                setAuthError(null);
              }}
            >
              {isRegister ? 'ALREADY REGISTERED? SWITCH TO LOGIN' : 'NEW CORRESPONDENT? CREATE ACCOUNT'}
            </button>
          </div>
        </form>

        <div className="demo-credentials-box">
          <p style={{ fontWeight: 800, marginBottom: '6px' }}>DEMO CREDENTIALS (CLICK TO PREFILL):</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="category-tab-btn"
              onClick={() => fillDemo('editor@broadside.local', 'editor123')}
            >
              EDITOR: editor@broadside.local
            </button>
            <button
              type="button"
              className="category-tab-btn"
              onClick={() => fillDemo('fika@broadside.local', 'fika123')}
            >
              AUTHOR: fika@broadside.local
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
