const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isTest = nodeEnv === 'test';

  return {
    nodeEnv,
    isTest,
    port: Number(process.env.PORT) || 5000,
    mongoUri: isTest
      ? process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobconnect-test'
      : requireEnv('MONGODB_URI'),
    jwtSecret: isTest
      ? process.env.JWT_SECRET || 'test-only-jwt-secret-not-for-production'
      : requireEnv('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  };
}

module.exports = { getConfig };
