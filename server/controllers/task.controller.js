import io from '../server';
import helpers from '../helpers/helper';
import Users from '../models/user.model';
import Tasks from '../models/task.model';
import Event from '../config/Events';
import Events from '../constants/events';

const addTask = (res) => {
  console.log('addTask');

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
  Users.find({}).then((users) => {
    const usersarr = {};

    users.forEach((user) => {
      usersarr[user] = user;
    });
    // console.log(usersarr)
    io.sockets.emit((Events.SOCKET_EMIT_GET_USERS), { data: usersarr });
  });
};

const getTasks = () => {
  helpers.getIds();
  console.log('getTasks');
  Tasks.find({}).then((taskss) => {
    const tasks = {};

    taskss.forEach((taks) => {
      tasks[taks._id] = taks;
    });
    io.sockets.emit((Events.SOCKET_EMIT_GET_TASKS), { data: tasks });
  });
};

const setTask = (res) => {
  console.log('res: ', res);
  console.log('setTask');
  Tasks.findOneAndUpdate({ _id: res.id }, { $set: { state: res.to, position: res.index } })
    .then(() => {
      io.sockets.emit(Events.SOCKET_EMIT_GET_UPDATES);
      // bot.sendMessage(496402356, `задача ${res.id} перенесена из ${res.from}  в ${res.to} `);
    });
};

const delTask = (res) => {
  console.log('delTask');
  console.log(res);
  Tasks.findOneAndDelete({ _id: res.taskid })
    .then(() => {
      io.sockets.emit(Events.SOCKET_EMIT_GET_UPDATES);
    });
};

const setRole = (res) => {
  console.log(res);

  Users.findOneAndUpdate({ telegramId: res.telegramId }, { $set: { role: res.role } })
    .then((doc) => {
      console.log('obj', doc);
      io.sockets.emit(Events.SOCKET_EMIT_GET_UPDATES);
    });
};

const setTaskExecuter = (res) => {
  let lastExecuter;
  console.log('setExecuter');
  // console.log(res)

  Tasks.findOne({ _id: res.taskId })
    .then((doc) => {
      lastExecuter = doc.executer;
      Users.update({ username: lastExecuter }, { $pull: { tasks: doc.id } })
        .then((obj) => {
          console.log('obj', obj);
        });
    });

  Tasks.findOneAndUpdate({ _id: res.taskId }, { $set: { executer: res.username } })
    .then((doc) => {
      io.sockets.emit((Events.SOCKET_EMIT_GET_UPDATES));

      if (!(res.username === 'нет исполнителя')) {
        Users.findOneAndUpdate({ username: res.username }, { $addToSet: { tasks: doc.id } })
          .then((obj) => {
            console.log('obj', doc);
            Event.emit((Events.EVENT_SET_EXICUTOR_BOT), obj.telegramId, doc.id, doc.taskname, doc.taskcontent);
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
