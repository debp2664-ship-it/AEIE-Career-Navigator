const mongoose = require('mongoose');

// Disable query buffering so queries fail immediately to fallback if offline
mongoose.set('bufferCommands', false);

let isConnected = false;

/**
 * Connect to MongoDB with graceful error handling.
 * If MongoDB is offline, the app enters hybrid fallback mode so APIs do not crash.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aeie_roadmap';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to prevent hanging if no local mongod
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] MongoDB connection warning: ${error.message}`);
    console.warn('[Database] Running in Hybrid Fallback Mode (In-Memory Datastore). Set MONGODB_URI in .env to connect to MongoDB Atlas or local daemon.');
    return null;
  }
};

const isDbReady = () => mongoose.connection.readyState === 1;

const getDBStatus = () => ({
  connected: isDbReady(),
  readyState: mongoose.connection.readyState,
  mode: isDbReady() ? 'MongoDB (Mongoose)' : 'Hybrid In-Memory Fallback'
});

module.exports = { connectDB, getDBStatus, isDbReady };
