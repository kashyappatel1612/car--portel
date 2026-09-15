const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/autosmart-ai';
    console.log(`Connecting to MongoDB at ${connStr}...`);
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`Primary MongoDB connection failed (${err.message}). Starting MongoMemoryServer fallback...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`Connected to MongoMemoryServer fallback at ${uri}`);
    } catch (memErr) {
      console.error('Failed to connect to MongoMemoryServer fallback:', memErr.message);
      process.exit(1);
    }
  }

  // Auto-seed database if empty
  try {
    const Car = require('../models/Car');
    const count = await Car.countDocuments();
    if (count === 0) {
      console.log('Database empty. Triggering automatic seed...');
      const seedData = require('../seed');
      await seedData(false);
    }
  } catch (seedCheckErr) {
    console.error('Auto-seed check failed:', seedCheckErr.message);
  }
};

module.exports = connectDB;
