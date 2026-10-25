const mongoose = require('mongoose');

async function connectDatabase(mongoUri) {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed.');
    console.error('Check that MongoDB is running and that MONGODB_URI in backend/.env is correct.');
    console.error(error.message);
    throw error;
  }
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase };
