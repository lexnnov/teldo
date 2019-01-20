import io from '../server';
import helpers from './helper';
import UserSchema from '../models/user.model';
import TaskSchema from '../models/task.model';
import db from '../config/mongo';
import Event from '../config/Events';

const addTask = (res) => {
  console.log('addTask');
  const Tasks = db.model('tasks', TaskSchema);

  Tasks
    .create({
      taskname: res.task_name,
      taskcontent: res.task_content,
      id: helpers.generateId(),
      state: 'to_do',
      executer: 'нет исполнителя',
      position: res.index,
    })
    .then((doc) => {
      console.log(doc._id);
    });
};

const getUser = () => {
  console.log('getUsers');
  const Users = db.model('users', UserSchema);
  Users.find({}).then((users) => {
    const usersarr = {};

    users.forEach((user) => {
      usersarr[user] = user;
    });
    // console.log(usersarr)
    io.sockets.emit(('getUsers'), { data: usersarr });
  });
};

const getTasks = () => {
  helpers.getIds();
  console.log('getTasks');
  const Tasks = db.model('tasks', TaskSchema);

  Tasks.find({}).then((taskss) => {
    const tasks = {};

    taskss.forEach((taks) => {
      tasks[taks._id] = taks;
    });
    io.sockets.emit(('getTasks'), { data: tasks });
  });
};

const setTask = (res) => {
  console.log('res: ', res);
  console.log('setTask');
  // const db = mongoose.createConnection('mongodb://localhost/test');
  const Tasks = db.model('tasks', TaskSchema);
  Tasks.findOneAndUpdate({ _id: res.id }, { $set: { state: res.to, position: res.index } }, (err) => {
    if (err) {
      console.log('Something wrong when updating data!');
    }
    io.sockets.emit('getUpdate');
    // bot.sendMessage(496402356, `задача ${res.id} перенесена из ${res.from}  в ${res.to} `);
  });
};

const delTask = (res) => {
  console.log('delTask');
  console.log(res);

  const Tasks = db.model('tasks', TaskSchema);
  Tasks.findOneAndDelete({ _id: res.taskid }, (err) => {
    if (err) {
      console.log('Something wrong when updating data!');
    }
    io.sockets.emit('getUpdate');
  });
};

const setRole = (res) => {
  const Users = db.model('users', UserSchema);
  console.log(res);

  Users.findOneAndUpdate({ telegramId: res.telegramId }, { $set: { role: res.role } }).then((doc) => {
    console.log('obj', doc);
    // Event.emit(('setRole'), doc.role);
    // return db.close();
  });
};

const setTaskExecuter = (res) => {
  let lastExecuter;
  console.log('setExecuter');
  const Tasks = db.model('tasks', TaskSchema);
  const Users = db.model('users', UserSchema);
  // console.log(res)

  Tasks.findOne({ _id: res.taskId }, (err, doc) => {
    lastExecuter = doc.executer;

    Users.update({ username: lastExecuter }, { $pull: { tasks: doc.id } }, (err2, obj) => {
      if (err2) {
        console.log('пвапваSomething wrong when updating data!');
      }
      console.log('obj', obj);
    });
  });

  Tasks.findOneAndUpdate({ _id: res.taskId }, { $set: { executer: res.username } }, (err, doc) => {
    if (err) {
      console.log('Something wrong when updating data!');
    }
    io.sockets.emit(('getUpdate'));

    if (!(res.username === 'нет исполнителя')) {
      Users.findOneAndUpdate({ username: res.username }, { $addToSet: { tasks: doc.id } }, (err1, obj) => {
        if (err1) {
          console.log('Something wrong when updating data!');
        }
        console.log('obj', obj);
        Event.emit(('setExecuterBot'), obj.telegramId);
        // return db.close();
      });
    }
  });
};

export default {
  addTask,
  getUser,
  getTasks,
  setTask,
  setTaskExecuter,
  setRole,
  delTask,
};
