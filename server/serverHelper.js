import db from './config/mongo';
import TaskSchema from './models/task.model';


let GlobalCounter = 0;
let id = [];

export default {
  getIds: () => {
    const Tasks = db.model('tasks', TaskSchema);


    Tasks.find({}, (err, taskss) => {

      taskss.forEach((taks) => {
        id.push(taks.id);
      });

      // return db.close();

    });
  },

  generateId: () => {
    id.sort().forEach((item) => {
      if (item === GlobalCounter) {
        GlobalCounter++;

      } else {
        console.log(GlobalCounter);


      }
    });
    return GlobalCounter;
  }
};
