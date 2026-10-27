import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DispatchDesk({ editingArticle, categories, onClose, onSaved }) {
  const { token } = useAuth();

  const [title, setTitle] = useState(editingArticle ? editingArticle.title : '');
  const [kicker, setKicker] = useState(editingArticle ? editingArticle.kicker || '' : 'FIELD DISPATCH');
  const [deck, setDeck] = useState(editingArticle ? editingArticle.deck || '' : '');
  const [content, setContent] = useState(editingArticle ? editingArticle.content : '');
  const [categoryId, setCategoryId] = useState(
    editingArticle && editingArticle.categoryId ? editingArticle.categoryId : (categories[0]?.id || '')
  );
  const [edition, setEdition] = useState(editingArticle ? editingArticle.edition || '' : 'VOL. I — NO. 05');
  const [featured, setFeatured] = useState(editingArticle ? Boolean(editingArticle.featured) : false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const estimatedMin = Math.max(1, Math.ceil(wordCount / 180));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are mandatory.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      title,
      kicker,
      deck,
      content,
      categoryId: categoryId ? parseInt(categoryId, 10) : null,
      edition,
      featured,
      published: true,
    };

    try {
      const url = editingArticle ? `/api/articles/${editingArticle.id}` : '/api/articles';
      const method = editingArticle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save broadside dispatch');
      }

      onSaved(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="editorial-modal-backdrop">
      <div className="editorial-modal-window" style={{ maxWidth: '780px' }}>
        <div className="modal-header-row">
          <h2 className="modal-title">
            {editingArticle ? 'EDIT DISPATCH' : 'COMPOSING DESK • NEW BROADSIDE'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && (
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
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">KICKER / TOP SLUG</label>
              <input
                type="text"
                className="form-input"
                placeholder="E.G. TECHNICAL MEMO, FRONT PAGE DISPATCH"
                value={kicker}
                onChange={(e) => setKicker(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">EDITION SLUG</label>
              <input
                type="text"
                className="form-input"
                placeholder="VOL. I — NO. 05"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">HEADLINE / TITLE *</label>
            <input
              type="text"
              className="form-input"
              style={{ fontWeight: 800, fontSize: '18px' }}
              placeholder="ENTER BOLD MONUMENTAL HEADLINE"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">DECK / SUBHEAD SUMMARY</label>
            <input
              type="text"
              className="form-input"
              placeholder="A concise, high-contrast one-sentence thesis..."
              value={deck}
              onChange={(e) => setDeck(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">EDITORIAL SECTION / CATEGORY</label>
              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '28px' }}>
              <input
                type="checkbox"
                id="leadFeature"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#000' }}
              />
              <label htmlFor="leadFeature" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                FEATURE AS LEAD
              </label>
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                FULL BROADSIDE TEXT *
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#666' }}>
                {wordCount} WORDS • ~{estimatedMin} MIN READ
              </span>
            </div>
            <textarea
              className="form-textarea"
              style={{ minHeight: '220px' }}
              placeholder="Compose your dispatch here. Paragraphs will be typeset with high-contrast broadside drop-caps."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              className="broadside-btn broadside-btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              CANCEL
            </button>
            <button type="submit" className="broadside-btn" disabled={loading}>
              {loading ? 'TRANSMITTING...' : editingArticle ? 'SAVE CORRECTIONS' : 'PUBLISH DISPATCH'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
