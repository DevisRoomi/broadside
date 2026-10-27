import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Masthead from './components/Masthead';
import Navigation from './components/Navigation';
import LeadArticle from './components/LeadArticle';
import ArticleCard from './components/ArticleCard';
import ArticleReader from './components/ArticleReader';
import DispatchDesk from './components/DispatchDesk';
import AuthModal from './components/AuthModal';

function BroadsideApp() {
  const { token, isAuthenticated } = useAuth();

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeArticle, setActiveArticle] = useState(null);
  const [isDeskOpen, setIsDeskOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [statusNotice, setStatusNotice] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery]);

  async function fetchData() {
    try {
      // Build query string
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'ALL') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const [artRes, catRes, statRes] = await Promise.all([
        fetch(`/api/articles?${params.toString()}`),
        fetch('/api/categories'),
        fetch('/api/articles/stats'),
      ]);

      if (artRes.ok) {
        const artJson = await artRes.json();
        setArticles(artJson.data);
      }
      if (catRes.ok) {
        const catJson = await catRes.json();
        setCategories(catJson.data);
      }
      if (statRes.ok) {
        const statJson = await statRes.json();
        setStats(statJson.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleNotice(msg) {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 5000);
  }

  async function handleDelete(articleId) {
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        handleNotice('Dispatch retracted from public archives.');
        setActiveArticle(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Network failure');
    }
  }

  function handleArticleSaved(saved) {
    setIsDeskOpen(false);
    setEditingArticle(null);
    handleNotice(`Dispatch "${saved.title}" registered successfully.`);
    fetchData();
    if (activeArticle) {
      setActiveArticle(saved);
    }
  }

  // Find lead article (featured or first in list)
  const leadArticle =
    selectedCategory === 'ALL' && !searchQuery.trim()
      ? articles.find((a) => a.featured) || articles[0]
      : null;

  const columnArticles = leadArticle
    ? articles.filter((a) => a.id !== leadArticle.id)
    : articles;

  return (
    <div className="broadside-wrapper">
      <Masthead
        stats={stats}
        onTitleClick={() => {
          setActiveArticle(null);
          setSelectedCategory('ALL');
          setSearchQuery('');
        }}
      />

      <Navigation
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDesk={() => {
          setEditingArticle(null);
          setIsDeskOpen(true);
        }}
        viewMode={activeArticle ? 'reader' : 'home'}
        setViewMode={() => setActiveArticle(null)}
      />

      {statusNotice && (
        <div className="broadside-notice-banner">
          <span>● NOTICE: {statusNotice}</span>
          <button
            onClick={() => setStatusNotice(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800 }}
          >
            ×
          </button>
        </div>
      )}

      {activeArticle ? (
        <ArticleReader
          article={activeArticle}
          onBack={() => setActiveArticle(null)}
          onEdit={(art) => {
            setEditingArticle(art);
            setIsDeskOpen(true);
          }}
          onDelete={handleDelete}
        />
      ) : (
        <main>
          {leadArticle && (
            <LeadArticle
              article={leadArticle}
              stats={stats}
              onSelectArticle={(art) => setActiveArticle(art)}
            />
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-mono)' }}>
              TYPESETTING BROADSIDE DISPATCHES...
            </div>
          ) : columnArticles.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                border: '1px dashed #000',
                margin: '40px 0',
              }}
            >
              <h3 style={{ textTransform: 'uppercase', marginBottom: '8px' }}>
                NO DISPATCHES FOUND
              </h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#666' }}>
                No records match criteria "{searchQuery || selectedCategory}".
              </p>
            </div>
          ) : (
            <div className="dispatches-grid">
              {columnArticles.map((art) => (
                <ArticleCard
                  key={art.id}
                  article={art}
                  onSelectArticle={(selected) => setActiveArticle(selected)}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {isDeskOpen && (
        <DispatchDesk
          editingArticle={editingArticle}
          categories={categories}
          onClose={() => {
            setIsDeskOpen(false);
            setEditingArticle(null);
          }}
          onSaved={handleArticleSaved}
        />
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <footer className="broadside-colophon">
        <div>
          <span>THE BROADSIDE ENGINE</span> • <span>EXPRESS</span> • <span>REACT</span> •{' '}
          <span>PRISMA ORM</span> • <span>JWT AUTH</span> • <span>CONTEXT API</span>
        </div>
        <div>
          <span>DEV: DEVIS RUMI</span> • <span>EDITORIAL BROADSIDE DESIGN SYSTEM</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BroadsideApp />
    </AuthProvider>
  );
}
