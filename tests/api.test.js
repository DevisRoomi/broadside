const assert = require('assert');
const app = require('../src/app');

async function runTests() {
  console.log('>>> STARTING BROADSIDE END-TO-END TEST SUITE <<<');
  const server = app.listen(5088);
  const BASE_URL = 'http://127.0.0.1:5088';

  try {
    // 1. API Overview & Spec
    console.log('[1/7] Testing GET /api...');
    const apiRes = await fetch(`${BASE_URL}/api`);
    const apiData = await apiRes.json();
    assert.strictEqual(apiRes.status, 200);
    assert.strictEqual(apiData.name, 'The Broadside API');
    console.log('   ✓ API Overview OK');

    // 2. Fetch categories
    console.log('[2/7] Testing GET /api/categories...');
    const catRes = await fetch(`${BASE_URL}/api/categories`);
    const catData = await catRes.json();
    assert.strictEqual(catRes.status, 200);
    assert(catData.data.length >= 4);
    console.log(`   ✓ Found ${catData.data.length} categories`);

    // 3. User Login
    console.log('[3/7] Testing POST /api/auth/login...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'editor@broadside.local', password: 'editor123' }),
    });
    const loginData = await loginRes.json();
    assert.strictEqual(loginRes.status, 200);
    assert(loginData.data.token, 'Token must be present in login response');
    const token = loginData.data.token;
    console.log('   ✓ Login authenticated, JWT received');

    // 4. Verify /api/auth/me with Bearer token
    console.log('[4/7] Testing GET /api/auth/me with Bearer JWT...');
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json();
    assert.strictEqual(meRes.status, 200);
    assert.strictEqual(meData.data.user.email, 'editor@broadside.local');
    console.log(`   ✓ Verified token for user: ${meData.data.user.name}`);

    // 5. Create Article
    console.log('[5/7] Testing POST /api/articles...');
    const newArticleRes = await fetch(`${BASE_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'AUTOMATED DISPATCH PROBE 01',
        kicker: 'TEST WIRE',
        deck: 'Verifying automated publishing flow across SQLite and Express.',
        content: 'This is test content written to verify the end-to-end publishing pipeline.',
        categoryId: catData.data[0].id,
      }),
    });
    const newArticle = await newArticleRes.json();
    assert.strictEqual(newArticleRes.status, 201);
    const createdId = newArticle.data.id;
    console.log(`   ✓ Dispatch created with ID: ${createdId}`);

    // 6. Update Article
    console.log('[6/7] Testing PUT /api/articles/:id...');
    const updateRes = await fetch(`${BASE_URL}/api/articles/${createdId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'AUTOMATED DISPATCH PROBE 01 (REVISED)',
      }),
    });
    const updated = await updateRes.json();
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updated.data.title, 'AUTOMATED DISPATCH PROBE 01 (REVISED)');
    console.log('   ✓ Dispatch updated');

    // 7. Delete Article
    console.log('[7/7] Testing DELETE /api/articles/:id...');
    const delRes = await fetch(`${BASE_URL}/api/articles/${createdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const delData = await delRes.json();
    assert.strictEqual(delRes.status, 200);
    console.log('   ✓ Dispatch retracted');

    console.log('>>> ALL 7 AUTOMATED BROADSIDE TESTS PASSED SUCCESSFULLY! <<<');
  } catch (err) {
    console.error('TEST FAILURE:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests();
