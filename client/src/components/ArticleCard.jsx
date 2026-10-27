import React from 'react';

export default function ArticleCard({ article, onSelectArticle }) {
  return (
    <article className="dispatch-column-card">
      <span className="card-edition-badge">{article.edition || 'VOL. I'}</span>
      <span className="card-kicker">
        {article.category?.name || article.kicker || 'DISPATCH'}
      </span>
      <h3 className="card-headline" onClick={() => onSelectArticle(article)}>
        {article.title}
      </h3>
      {article.deck && <p className="card-deck">{article.deck}</p>}
      <div className="card-footer">
        <span>BY {article.author?.name?.toUpperCase() || 'STAFF'}</span>
        <span>{article.readMinutes || 3} MIN</span>
      </div>
    </article>
  );
}
