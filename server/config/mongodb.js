// server/config/mongodb.js
import mongoose from 'mongoose';
import { env } from './env.js';

let mongoConnection = null;

export async function connectMongoDB() {
  if (mongoConnection) return mongoConnection;

  try {
    mongoConnection = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB connected successfully');
    return mongoConnection;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    throw error;
  }
}

export async function disconnectMongoDB() {
  if (mongoConnection) {
    await mongoose.disconnect();
    mongoConnection = null;
  }
}
