import Tasks from '../models/task.model';

let id = [];

export default {
  getIds: () => {
    Tasks.find({})
      .then((taskss) => {
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
