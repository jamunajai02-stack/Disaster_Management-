require('dotenv').config();
const dns = require('dns');
const mongoose = require('mongoose');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const srvUri = process.env.MONGODB_URI;
const standardUri = process.env.MONGODB_URI_STANDARD;

async function tryConnect(label, uri) {
  if (!uri) {
    console.log(`${label}: skipped (not set)`);
    return false;
  }
  const conn = mongoose.createConnection(uri, {
    serverSelectionTimeoutMS: 25000,
    family: 4,
  });
  try {
    await conn.asPromise();
    console.log(`${label}: SUCCESS`);
    await conn.close();
    return true;
  } catch (error) {
    console.error(`${label}: FAILED — ${error.message}`);
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('  → Fix: Atlas → Database Access → edit user → reset password');
      console.error('  → Then copy fresh connection string from Atlas → Connect → Drivers');
    }
    if (error.message.includes('whitelist')) {
      console.error('  → Fix: Atlas → Network Access → add your IP or 0.0.0.0/0');
    }
    try {
      await conn.close();
    } catch {
      /* ignore */
    }
    return false;
  }
}

(async () => {
  console.log('Testing MongoDB connectivity...\n');
  const okSrv = await tryConnect('SRV URI', srvUri);
  const okStandard = okSrv ? true : await tryConnect('Standard URI', standardUri);

  if (!okSrv && !okStandard) {
    console.log('\nFallback for review: npm run dev:embedded  (no Atlas needed)\n');
  }
  process.exit(okSrv || okStandard ? 0 : 1);
})();
