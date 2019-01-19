import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TaskModel = new Schema({
  id: Number,
  taskname: String,
  taskcontent: String,
  state: String,
  executer: String,
  position: Number,
  help: Number,
});

export default TaskModel;
