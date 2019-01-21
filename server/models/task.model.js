import mongoose from 'mongoose';
import db from '../config/mongo';

const UserSchema = new mongoose.Schema({
  id: Number,
  taskname: String,
  taskcontent: String,
  state: String,
  executer: String,
  position: Number,
  help: Number,
});

export default db.model('tasks', UserSchema);
