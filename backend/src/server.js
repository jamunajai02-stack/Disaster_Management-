const app = require('./app');
const config = require('./config');
const { connectDatabase } = require('./config/database');
const User = require('./models/User');
const { runSeed } = require('./seed/seed');

async function start() {
  await connectDatabase();

  if (process.env.USE_EMBEDDED_MONGO === 'true') {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Embedded DB empty — auto-seeding demo data...');
      await runSeed({ disconnect: false });
    }
  }

  app.listen(config.port, () => {
    console.log(`SDRP backend listening on port ${config.port}`);
  });
}

start().catch((error) => {
  console.error('\n❌ Failed to start backend:', error.message);
  if (error.message.includes('whitelist') || error.message.includes('MongoDB')) {
    console.error('  1. If "bad auth": Atlas → Database Access → reset password → update .env');
    console.error('  2. Atlas → Network Access → add 0.0.0.0/0 for demo day');
    console.error('  3. Run: npm run test:mongo');
    console.error('  4. Review fallback: npm run seed:embedded && npm run dev:embedded');
    console.error('  See docs/mongodb-troubleshooting.md\n');
  }
  process.exit(1);
});
