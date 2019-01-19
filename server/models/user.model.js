import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  telegramId: Number,
  username: String,
  firstname: String,
  lastname: String,
  role: String,
  tasks: [String],
  password: String,
});

export default UserSchema;
