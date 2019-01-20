import config from 'config';
import mongoose from 'mongoose';
const mongoConfig = config.get('Mongo');

const db = mongoose.createConnection(mongoConfig.db);

db.on('connected', () => {
  console.log('connected to mongodb');
});

db.on('disconnected', () => {
  console.log('connection disconnected');
});

export default db;
