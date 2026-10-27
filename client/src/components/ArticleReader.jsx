import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ArticleReader({ article, onBack, onEdit, onDelete }) {
  const { user } = useAuth();

  if (!article) return null;

  const canManage =
    user && (user.id === article.authorId || user.role === 'EDITOR' || user.role === 'ADMIN');

  return (
    <div className="reader-container">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="broadside-btn broadside-btn-secondary" onClick={onBack}>
          ← RETURN TO BROADSHEET
        </button>

        {canManage && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="broadside-btn" onClick={() => onEdit(article)}>
              EDIT DISPATCH
            </button>
            <button
              className="broadside-btn broadside-btn-danger"
              onClick={() => {
                if (window.confirm('Confirm removal of this dispatch from the public register?')) {
                  onDelete(article.id);
                }
              }}
            >
              RETRACT DISPATCH
            </button>
          </div>
        )}
      </div>

      <header>
        <div className="reader-kicker">
          {article.category?.name || 'SPECIAL DISPATCH'} • {article.kicker || 'FRONT PAGE RECORD'}
        </div>
        <h1 className="reader-headline">{article.title}</h1>
        {article.deck && <p className="reader-deck">{article.deck}</p>}

        <div className="reader-meta-bar">
          <span>BY {article.author?.name?.toUpperCase() || 'EDITORIAL STAFF'}</span>
          <span>EDITION: {article.edition}</span>
          <span>READING TIME: {article.readMinutes} MIN</span>
          <span>DATE: {new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
      </header>

      <main className="reader-body">
        {article.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </main>

      <footer className="author-colophon-box">
        {article.author?.avatar && (
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="author-avatar"
          />
        )}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-masthead)',
              fontSize: '18px',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            {article.author?.name}
          </h4>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#555', marginBottom: '8px' }}>
            OFFICIAL CORRESPONDENT • {article.author?.role}
          </p>
          <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#222' }}>
            {article.author?.bio || 'Author contributes regularly to The Broadside register.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
