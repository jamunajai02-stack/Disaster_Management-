require('dotenv').config();

const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  weatherDemoMode: process.env.WEATHER_DEMO_MODE === 'true' || !process.env.WEATHER_API_KEY,
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  demoMode: process.env.DEMO_MODE !== 'false',
  useAwsS3:
    process.env.USE_AWS_S3 === 'true' &&
    Boolean(process.env.AWS_ACCESS_KEY_ID) &&
    Boolean(process.env.AWS_S3_BUCKET) &&
    Boolean(process.env.AWS_REGION),
  aws: {
    region: process.env.AWS_REGION || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    s3Bucket: process.env.AWS_S3_BUCKET || '',
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  },
};

module.exports = config;
