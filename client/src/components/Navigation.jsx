import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navigation({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAuth,
  onOpenDesk,
  viewMode,
  setViewMode,
}) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="editorial-nav">
      <div className="nav-categories">
        <button
          className={`category-tab-btn ${selectedCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => {
            onSelectCategory('ALL');
            if (viewMode !== 'home') setViewMode('home');
          }}
        >
          [ALL BROADSIDES]
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
            onClick={() => {
              onSelectCategory(cat.slug);
              if (viewMode !== 'home') setViewMode('home');
            }}
          >
            {cat.name} ({cat.articleCount})
          </button>
        ))}
      </div>

      <div className="nav-controls">
        <input
          type="text"
          className="search-input-field"
          placeholder="SEARCH ARCHIVE..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            if (viewMode !== 'home') setViewMode('home');
          }}
        />

        {isAuthenticated ? (
          <>
            <button
              className="broadside-btn"
              onClick={onOpenDesk}
              title="Open Editorial Dispatch Desk"
            >
              + NEW DISPATCH
            </button>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 8px',
                border: '1px solid #000',
                background: '#fff',
              }}
            >
              {user?.name?.toUpperCase()} [{user?.role}]
            </span>
            <button
              className="broadside-btn broadside-btn-secondary"
              onClick={logout}
              title="Sign Out"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <button className="broadside-btn" onClick={onOpenAuth}>
            AUTHOR ACCESS / LOGIN
          </button>
        )}
      </div>
    </nav>
  );
}
