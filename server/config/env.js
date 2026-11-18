// server/config/env.js
import 'dotenv/config';


export const env = {
  PORT: Number(process.env.PORT) || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-key-min-32-chars',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  AUTH_REQUIRED: process.env.AUTH_REQUIRED !== 'false',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/jobtrail',
  DB_TYPE: process.env.DB_TYPE || 'mongodb',
};