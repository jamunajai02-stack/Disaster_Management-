const dns = require('dns');
const mongoose = require('mongoose');
const config = require('./index');

let isConnected = false;
let embeddedServer = null;

async function startEmbeddedMongo() {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  embeddedServer = await MongoMemoryServer.create();
  const uri = embeddedServer.getUri('sdrp');
  console.log('Using embedded MongoDB (review/demo mode — data resets when server stops)');
  return uri;
}

async function connectDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  mongoose.set('strictQuery', true);

  const uris = [];
  if (process.env.USE_EMBEDDED_MONGO === 'true') {
    uris.push(await startEmbeddedMongo());
  } else {
    if (config.mongoUri) uris.push(config.mongoUri);
    if (process.env.MONGODB_URI_STANDARD) uris.push(process.env.MONGODB_URI_STANDARD);
    if (process.env.MONGODB_URI_LOCAL) uris.push(process.env.MONGODB_URI_LOCAL);
  }

  let lastError;
  for (const uri of uris) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000,
        family: 4,
      });
      isConnected = true;
      console.log('MongoDB connected');
      return mongoose.connection;
    } catch (error) {
      lastError = error;
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect().catch(() => {});
      }
      const hint =
        error.message.includes('bad auth') || error.message.includes('Authentication failed')
          ? ' (check Atlas Database Access password)'
          : '';
      console.warn(`MongoDB connection attempt failed${hint}: ${error.message}`);
    }
  }

  throw lastError || new Error('MongoDB connection failed');
}

async function stopEmbeddedMongo() {
  if (embeddedServer) {
    await embeddedServer.stop();
    embeddedServer = null;
  }
}

module.exports = { connectDatabase, stopEmbeddedMongo };
