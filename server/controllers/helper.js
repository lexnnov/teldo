import db from '../config/mongo';
import TaskSchema from '../models/task.model';


let id = [];

export default {
  getIds: () => {
    const Tasks = db.model('tasks', TaskSchema);
    Tasks.find({}, (err, taskss) => {
      taskss.forEach((taks) => {
        id.push(taks.id);
      });
    });
  },

  generateId: () => {
    let GlobalCounter = 0;
    id.sort().forEach((item) => {
      if (item === GlobalCounter) {
        GlobalCounter++;
      }
    });
    return GlobalCounter;
  },
};
