const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { signToken } = require('../config/jwt');

const prisma = new PrismaClient();

async function register(req, res, next) {
  try {
    const { name, email, password, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        bio: bio ? bio.trim() : 'Contributing Dispatcher & Editorial Writer.',
        role: 'AUTHOR',
      },
      select: { id: true, name: true, email: true, role: true, bio: true, avatar: true, createdAt: true },
    });

    const token = signToken({ userId: user.id, role: user.role });

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Welcome to The Broadside dispatch.',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Wrong password.' });
    }

    const token = signToken({ userId: user.id, role: user.role });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    return res.json({
      success: true,
      message: 'Authentication confirmed.',
      data: { user: safeUser, token },
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  return res.json({
    success: true,
    data: { user: req.user },
  });
}

module.exports = {
  register,
  login,
  me,
};
