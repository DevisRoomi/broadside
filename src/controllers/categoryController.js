const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getAll(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { published: true } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      articleCount: c._count.articles,
    }));

    return res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll };
