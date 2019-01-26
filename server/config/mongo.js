import config from 'config';
import mongoose from 'mongoose';
const mongoConfig = config.get('Mongo');

mongoose.connect(mongoConfig.db);

mongoose.connection.on('connected', () => {
  console.log('connected to mongodb');
});

mongoose.connection.on('disconnected', () => {
  console.log('connection disconnected');
});

export default mongoose;
