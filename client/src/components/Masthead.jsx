import React, { useState, useEffect } from 'react';

export default function Masthead({ onTitleClick, stats }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) + ' • ' + now.toLocaleTimeString('en-US', { hour12: false }) + ' WIB'
      );
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="masthead-container">
      <div className="top-wire-bar">
        <span>DAILY EDITORIAL REGISTER • VOL. I — NO. 01</span>
        <span className="live-stamp">LIVE DISPATCH FEED</span>
        <span>PRICE: FREE INQUIRY</span>
      </div>

      <div style={{ marginTop: '16px' }}>
        <p className="masthead-motto">
          INDEPENDENT RECORD OF SOFTWARE ARCHITECTURE, DESIGN & PUBLIC DISCOURSE
        </p>
        <h1 className="masthead-title" onClick={onTitleClick} title="Return to Front Page">
          THE BROADSIDE
        </h1>
      </div>

      <div className="masthead-edition-row">
        <span>{timeStr || 'EDITORIAL DISPATCH DESK'}</span>
        <span>CIRCULATION: {stats?.totalArticles || 4} ARCHIVED DISPATCHES</span>
        <span>PRINTED IN MONOCHROME</span>
      </div>
    </header>
  );
}
