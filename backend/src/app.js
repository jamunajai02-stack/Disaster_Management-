const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { ensureUploadsDir } = require('./services/uploadService');

ensureUploadsDir();

const app = express();

app.use(helmet());
const allowedOrigins = String(config.corsOrigin || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (config.nodeEnv !== 'production') {
        const isLocal =
          /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin) ||
          /^https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)[\d.]+(:\d+)?$/i.test(origin);
        if (isLocal || allowedOrigins.includes(origin)) return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
  })
);

app.use('/', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
