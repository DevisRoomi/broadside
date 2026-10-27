require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  THE BROADSIDE — High-Contrast Editorial Dispatch`);
  console.log(`  Server live on: http://localhost:${PORT}`);
  console.log(`  Herd link:      http://broadside.test (via public/index.php)`);
  console.log(`  API index:      http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
