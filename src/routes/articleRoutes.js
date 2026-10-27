const express = require('express');
const {
  getAll,
  getBySlug,
  create,
  update,
  remove,
  getStats,
} = require('../controllers/articleController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', getStats);
router.get('/', getAll);
router.get('/:slug', getBySlug);
router.post('/', requireAuth, create);
router.put('/:id', requireAuth, update);
router.delete('/:id', requireAuth, remove);

module.exports = router;
