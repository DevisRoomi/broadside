const { PrismaClient } = require('@prisma/client');
const { slugify } = require('../utils/slugify');

const prisma = new PrismaClient();

// GET /api/articles
async function getAll(req, res, next) {
  try {
    const { category, search, authorId, all } = req.query;

    const where = {};

    // By default, public list only shows published articles unless requesting author's drafts
    if (!all) {
      where.published = true;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (authorId) {
      where.authorId = parseInt(authorId, 10);
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { deck: { contains: search } },
        { content: { contains: search } },
        { kicker: { contains: search } },
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true, bio: true, avatar: true },
        },
        category: true,
      },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });

    return res.json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/articles/:slugOrId
async function getBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const isNumeric = /^\d+$/.test(slug);
    const where = isNumeric ? { id: parseInt(slug, 10) } : { slug };

    const article = await prisma.article.findUnique({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true, bio: true, avatar: true },
        },
        category: true,
      },
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Broadside dispatch not found.' });
    }

    // Related articles
    const related = await prisma.article.findMany({
      where: {
        id: { not: article.id },
        published: true,
        ...(article.categoryId ? { categoryId: article.categoryId } : {}),
      },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        kicker: true,
        deck: true,
        edition: true,
        readMinutes: true,
        createdAt: true,
      },
    });

    return res.json({
      success: true,
      data: { article, related },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/articles (protected)
async function create(req, res, next) {
  try {
    const { title, kicker, deck, content, categoryId, coverImage, published, featured, edition } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    let baseSlug = slugify(title);
    if (!baseSlug) baseSlug = `dispatch-${Date.now()}`;
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const wordCount = content.trim().split(/\s+/).length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 180));

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug: uniqueSlug,
        kicker: kicker ? kicker.trim() : 'EDITORIAL DISPATCH',
        deck: deck ? deck.trim() : null,
        content: content.trim(),
        coverImage: coverImage ? coverImage.trim() : null,
        published: published !== undefined ? Boolean(published) : true,
        featured: Boolean(featured),
        edition: edition ? edition.trim() : 'VOL. I — NO. 05',
        readMinutes,
        authorId: req.user.id,
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true, bio: true, avatar: true },
        },
        category: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Broadside dispatch drafted and published successfully.',
      data: article,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/articles/:id (protected)
async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.article.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    // Only author or editor/admin can update
    if (existing.authorId !== req.user.id && req.user.role !== 'EDITOR' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized. You do not own this dispatch.' });
    }

    const { title, kicker, deck, content, categoryId, coverImage, published, featured, edition } = req.body;

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (kicker !== undefined) data.kicker = kicker.trim();
    if (deck !== undefined) data.deck = deck.trim();
    if (content !== undefined) {
      data.content = content.trim();
      const wordCount = content.trim().split(/\s+/).length;
      data.readMinutes = Math.max(1, Math.ceil(wordCount / 180));
    }
    if (coverImage !== undefined) data.coverImage = coverImage ? coverImage.trim() : null;
    if (published !== undefined) data.published = Boolean(published);
    if (featured !== undefined) data.featured = Boolean(featured);
    if (edition !== undefined) data.edition = edition.trim();
    if (categoryId !== undefined) data.categoryId = categoryId ? parseInt(categoryId, 10) : null;

    const updated = await prisma.article.update({
      where: { id },
      data,
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true, bio: true, avatar: true },
        },
        category: true,
      },
    });

    return res.json({
      success: true,
      message: 'Broadside dispatch updated.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/articles/:id (protected)
async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.article.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    if (existing.authorId !== req.user.id && req.user.role !== 'EDITOR' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized. You do not own this dispatch.' });
    }

    await prisma.article.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Broadside dispatch removed from archives.',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/stats
async function getStats(req, res, next) {
  try {
    const [totalArticles, totalCategories, totalAuthors] = await Promise.all([
      prisma.article.count({ where: { published: true } }),
      prisma.category.count(),
      prisma.user.count(),
    ]);

    return res.json({
      success: true,
      data: {
        totalArticles,
        totalCategories,
        totalAuthors,
        masthead: 'THE BROADSIDE DISPATCH',
        vol: 'VOL. I',
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  getBySlug,
  create,
  update,
  remove,
  getStats,
};
