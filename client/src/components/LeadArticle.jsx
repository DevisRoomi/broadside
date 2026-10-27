import React from 'react';

export default function LeadArticle({ article, onSelectArticle, stats }) {
  if (!article) return null;

  return (
    <section className="lead-story-banner">
      <div className="lead-main-col">
        <span className="lead-kicker">{article.kicker || 'FRONT PAGE SPECIAL'}</span>
        <h2 className="lead-headline" onClick={() => onSelectArticle(article)}>
          {article.title}
        </h2>
        {article.deck && <p className="lead-deck">{article.deck}</p>}
        <p className="lead-content-preview">
          {article.content.slice(0, 320)}...
        </p>
        <div className="lead-byline">
          <span>BY {article.author?.name?.toUpperCase() || 'EDITORIAL STAFF'}</span>
          <span>•</span>
          <span>EDITION: {article.edition}</span>
          <span>•</span>
          <span>{article.readMinutes} MIN READ</span>
          <span>•</span>
          <button
            onClick={() => onSelectArticle(article)}
            style={{
              background: 'none',
              border: 'none',
              textDecoration: 'underline',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            [CONTINUE READING BROADSIDE →]
          </button>
        </div>
      </div>

      <aside className="lead-sidebar-box">
        <div>
          <h3 className="sidebar-box-title">EDITORIAL REGISTER</h3>
          <div className="sidebar-stats-list">
            <div className="stat-item-row">
              <span>ACTIVE DISPATCHES</span>
              <span className="stat-number">{stats?.totalArticles || 4}</span>
            </div>
            <div className="stat-item-row">
              <span>SECTIONS</span>
              <span className="stat-number">{stats?.totalCategories || 4}</span>
            </div>
            <div className="stat-item-row">
              <span>REGISTERED AUTHORS</span>
              <span className="stat-number">{stats?.totalAuthors || 2}</span>
            </div>
            <div className="stat-item-row">
              <span>SECURITY PROTOCOL</span>
              <span className="stat-number">JWT / PRISMA</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '2px solid #000', paddingTop: '12px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.4 }}>
            <strong>THE BROADSIDE CODE:</strong> Unflinching technical clarity. Zero decoration. Every dispatch signed and verifiable.
          </p>
        </div>
      </aside>
    </section>
  );
}
