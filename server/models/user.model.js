import mongoose from 'mongoose';
import db from '../config/mongo';

const UserSchema = new mongoose.Schema({
  telegramId: Number,
  username: String,
  firstname: String,
  lastname: String,
  role: String,
  tasks: [String],
  password: String,
});

export default db.model('users', UserSchema);
