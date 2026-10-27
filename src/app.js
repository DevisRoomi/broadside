const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Info Endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'The Broadside API',
    tagline: 'High-Contrast Editorial Publishing Engine',
    version: '1.0.0',
    syllabus_coverage: [
      'Restful API (Express.js)',
      'JWT Authentication (jsonwebtoken)',
      'Prisma ORM (SQLite/MySQL)',
      'React Context State (AuthContext)',
      'Secure User Authentication & RBAC',
    ],
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
      articles: [
        'GET /api/articles',
        'GET /api/articles/:slug',
        'POST /api/articles',
        'PUT /api/articles/:id',
        'DELETE /api/articles/:id',
        'GET /api/articles/stats',
      ],
      categories: ['GET /api/categories'],
    },
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);

// Serve static client if built
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// SPA fallback for frontend client routing
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  const indexPath = path.join(clientDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>THE BROADSIDE — Editorial Dispatch</title>
          <style>
            body { font-family: 'Georgia', serif; background: #f6f4ee; color: #111; margin: 0; padding: 40px; }
            .container { max-width: 800px; margin: 0 auto; border: 3px solid #111; padding: 40px; background: #fff; box-shadow: 12px 12px 0 #111; }
            h1 { font-size: 42px; text-transform: uppercase; letter-spacing: -1px; border-bottom: 2px solid #111; padding-bottom: 15px; margin-top: 0; }
            .badge { display: inline-block; background: #111; color: #fff; padding: 4px 10px; font-family: monospace; font-size: 13px; text-transform: uppercase; }
            pre { background: #f0ede4; padding: 15px; border-left: 4px solid #111; overflow-x: auto; font-family: monospace; font-size: 14px; }
            a { color: #111; font-weight: bold; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <span class="badge">BROADSIDE PRESSROOM</span>
            <h1>THE BROADSIDE API ENGINE</h1>
            <p style="font-size: 18px; line-height: 1.6; font-style: italic;">
              Express backend is operational. The React production client is not yet built.
            </p>
            <p>Run <code>npm run build</code> in the root folder to compile the React client into <code>client/dist</code>, or run <code>npm run dev</code> for development mode.</p>
            <h3>Explore API:</h3>
            <ul>
              <li><a href="/api">/api (API Overview & Syllabus Spec)</a></li>
              <li><a href="/api/articles">/api/articles (Editorial Dispatches)</a></li>
              <li><a href="/api/categories">/api/categories (Categories)</a></li>
              <li><a href="/api/articles/stats">/api/articles/stats (Broadsheet Statistics)</a></li>
            </ul>
          </div>
        </body>
        </html>
      `);
    }
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[Broadside Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Editorial Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

module.exports = app;
