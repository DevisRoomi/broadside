const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning old records ---');
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('--- Seeding Users ---');
  const hashedEditorPass = await bcrypt.hash('editor123', 10);
  const hashedFikaPass = await bcrypt.hash('fika123', 10);

  const editor = await prisma.user.create({
    data: {
      name: 'Devis Rumi',
      email: 'editor@broadside.local',
      password: hashedEditorPass,
      role: 'EDITOR',
      bio: 'Editor-in-Chief, High-Contrast Broadside Desk. Crafting rigorous dispatches and stark typography.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });

  const fika = await prisma.user.create({
    data: {
      name: 'Fika Ridaul Maulayya',
      email: 'fika@broadside.local',
      password: hashedFikaPass,
      role: 'AUTHOR',
      bio: 'FullStack JavaScript Architect & Author. Specialist in Express, React, Prisma, and JWT Auth pipelines.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  });

  console.log('--- Seeding Categories ---');
  const catDispatch = await prisma.category.create({
    data: {
      name: 'FIELD DISPATCH',
      slug: 'field-dispatch',
      description: 'First-hand dispatches from the frontlines of software architecture and engineering.',
    },
  });

  const catInvestigation = await prisma.category.create({
    data: {
      name: 'INVESTIGATION',
      slug: 'investigation',
      description: 'Deep dives, forensic post-mortems, and technical exposés.',
    },
  });

  const catManifesto = await prisma.category.create({
    data: {
      name: 'MANIFESTO',
      slug: 'manifesto',
      description: 'Design declarations, architectural principles, and editorial stances.',
    },
  });

  const catCulture = await prisma.category.create({
    data: {
      name: 'TYPOGRAPHIC NOTES',
      slug: 'typographic-notes',
      description: 'Essays on high-contrast editorial design, print heritage, and web craft.',
    },
  });

  console.log('--- Seeding Articles ---');
  await prisma.article.create({
    data: {
      title: 'THE DEATH OF CEREMONY: WHY MINIMAL STACKS TRIUMPH OVER ENTERPRISE BLOAT',
      slug: 'death-of-ceremony-minimal-stacks',
      kicker: 'LEAD INVESTIGATION • FRONT PAGE DISPATCH',
      deck: 'A forensic audit into three decades of web architecture proves one law: the simplest stack with explicit trust boundaries outlives every multi-tiered abstraction layer.',
      content: `The modern web industry spent ten years fabricating complexity to justify its own overhead. We witnessed single-page applications burdened with twelve build steps, state managers larger than operating system kernels, and deployment pipelines that required distributed consensus just to push a typographical correction.

Here in the Broadside editorial room, we affirm the counter-reformation:
1. **Express.js remains unbeatable for raw clarity.** A request arrives, passes through explicit middleware gates, hits an endpoint handler, queries a database via Prisma, and returns a predictable JSON payload.
2. **Stateless JWT seals trust at the perimeter.** When cryptographic signatures verify authorization without roundtrip session lookups, latency plunges to bare network physics.
3. **High contrast is respect for the reader's eye.** Stark monochrome ink, deliberate serif headers, rigid grids, and zero decorative fluff convey authority that pastel gradients can never mimic.

Software engineering is not the art of adding moving parts; it is the brutal discipline of removing them until nothing non-essential remains.`,
      edition: 'VOL. I — NO. 01',
      readMinutes: 4,
      featured: true,
      published: true,
      authorId: editor.id,
      categoryId: catManifesto.id,
    },
  });

  await prisma.article.create({
    data: {
      title: 'ANATOMY OF TOKEN AUTHENTICATION IN DISTRIBUTED JAVASCRIPT SYSTEMS',
      slug: 'anatomy-token-auth-javascript',
      kicker: 'TECHNICAL FIELD MEMO',
      deck: 'Deconstructing JSON Web Tokens: signature verification, expiration boundaries, and state distribution across React Context.',
      content: `Authentication is a contract between three parties: the user's credential, the issuing authority, and the consuming client. When implemented cleanly via JWT and React Context, the pipeline achieves complete architectural separation:

- **Issue Phase:** The Express server validates credentials against Prisma-backed hashed passwords using bcrypt. Upon confirmation, a signed token carrying subject identity and roles is returned.
- **Propagation Phase:** The React client receives the token, persists it in local storage, and initializes a top-level AuthContext. Every child component gains immediate declarative access to authenticated state.
- **Verification Phase:** Downstream API calls attach the bearer token in headers. An Express middleware inspects the signature with zero database overhead.

This is the standard taught in rigorous fullstack curricula: clear boundaries, zero magic, verifiable security.`,
      edition: 'VOL. I — NO. 02',
      readMinutes: 5,
      featured: false,
      published: true,
      authorId: fika.id,
      categoryId: catDispatch.id,
    },
  });

  await prisma.article.create({
    data: {
      title: 'THE BROADSIDE AESTHETIC: RESURRECTING 19TH-CENTURY PRINT IN MODERN CSS',
      slug: 'broadside-aesthetic-resurrecting-print-css',
      kicker: 'DESIGN PHILOSOPHY',
      deck: 'How ink traps, heavy ruling lines, and strict monospace metadata establish dramatic tension on digital displays.',
      content: `The 19th-century broadside was an emergency printing format: proclamations, breaking naval news, political decrees, and manifestos nailed to town square posts. It utilized whatever ink was darkest and whatever serif type was largest.

Translating this to web design requires rejecting the homogenization of modern web frameworks:
- Rule lines are not decorative; they are architectural boundaries dividing thoughts.
- Typography must have grit: Georgia, Playfair, and Garamond set against rigid monospace tabular numerals.
- Color is an indulgence: 98% black ink on warm off-white newsprint forces the reader to confront ideas rather than chrome.`,
      edition: 'VOL. I — NO. 03',
      readMinutes: 3,
      featured: false,
      published: true,
      authorId: editor.id,
      categoryId: catCulture.id,
    },
  });

  await prisma.article.create({
    data: {
      title: 'PRISMA ORM UNDER THE HOOD: QUERY ENGINE DYNAMICS AND TYPE SAFETY',
      slug: 'prisma-orm-under-the-hood',
      kicker: 'ARCHITECTURE REPORT',
      deck: 'How Prisma bridges relational database semantics and TypeScript runtime structures with zero schema drift.',
      content: `Object-relational mapping has historically suffered from impedance mismatch. Prisma solves this by treating the schema as the single source of truth.

When Express controllers invoke \`prisma.article.findMany({ include: { author: true, category: true } })\`, the Rust query engine compiles optimal SQL with deterministic joins. No N+1 query surprises, no phantom fields, and complete compile-time contract verification.`,
      edition: 'VOL. I — NO. 04',
      readMinutes: 4,
      featured: false,
      published: true,
      authorId: fika.id,
      categoryId: catInvestigation.id,
    },
  });

  console.log('--- Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
