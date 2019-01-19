import mongoose from 'mongoose';

const db = mongoose.createConnection('mongodb://localhost/test');

db.on('connected', () => {
  console.log('connected to mongodb');
});

db.on('disconnected', () => {
  console.log('connection disconnected');
});

export default db;
