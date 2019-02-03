import mongoose from 'mongoose';
import io from '../server';
import helpers from '../helpers/helper';
import Users from '../models/user.model';
import Tasks from '../models/task.model';
import Event from '../config/Events';
import Events from '../constants/events';
import States from '../constants/states';

const addTask = (res) => {
  console.log('addTask');
  Tasks.create({
    _id: new mongoose.Types.ObjectId(),
    taskname: res.task_name,
    taskcontent: res.task_content,
    id: helpers.generateId(),
    state: States.STATE_TO_DO,
    executor: States.EXECUTOR,
    position: res.index,
  });
};

const getUser = () => {
  console.log('getUsers');
  const usersObj = {};
  Users.find({})
    .then((users) => {
      if (users.length === 0) throw 'Нет пользователей в БД!';
      users.forEach((user) => {
        usersObj[user] = user;
      });
      io.sockets.emit((Events.SOCKET_EMIT_GET_USERS), { data: usersObj });
    })
    .catch((err) => {
      console.log('ERROR', err);
    });
};

const getTasks = () => {
  console.log('getTasks');
  helpers.getIds();
  const tasksObj = {};
  Tasks.find({})
    .then((tasks) => {
      if (tasks.length === 0) {
        io.sockets.emit((Events.SOCKET_EMIT_GET_TASKS), { data: 'no_tasks' });
        throw 'Нет задач в БД';
      }
      tasks.forEach((task) => {
        tasksObj[task._id] = task;
      });
      io.sockets.emit((Events.SOCKET_EMIT_GET_TASKS), { data: tasksObj });
    })
    .catch((err) => {
      console.log('ERROR:', err);
    });
};

const setTask = (res) => {
  console.log('res: ', res);
  console.log('setTask');
  Tasks.findOneAndUpdate({ _id: res.id }, { $set: { state: res.to, position: res.index } })
    .then((doc) => {
      if (!doc) throw 'Нет задач в БД';
      io.sockets.emit(Events.SOCKET_EMIT_GET_UPDATES);
      // bot.sendMessage(496402356, `задача ${res.id} перенесена из ${res.from}  в ${res.to} `);
    })
    .catch((err) => {
      console.log('ERROR', err);
    });
};

const delTask = (res) => {
  console.log('delTask');
  let lastexecutor;
  Tasks.findOne({ _id: res.taskid })
    .then((doc) => {
      if (!doc) throw 'Нет задач в БД';
      lastexecutor = doc.executor;
      return Users.update({ username: lastexecutor }, { $pull: { tasks: doc.id } });
    })
    .catch((err) => {
      console.log('ERROR', err);
    });

  Tasks.findOneAndDelete({ _id: res.taskid })
    .then(() => {
      io.sockets.emit(Events.SOCKET_EMIT_GET_UPDATES);
    })
    .catch((err) => {
      console.log('ERROR', err);
    });
};

const setRole = (res) => {
  console.log(res);
  Users.findOneAndUpdate({ telegramId: res.telegramId }, { $set: { role: res.role } })
    .then((doc) => {
      if (!doc) throw 'Нет пользоватедя в БД';
      io.sockets.emit(Events.SOCKET_EMIT_GET_UPDATES);
    })
    .catch((err) => {
      console.log('ERROR', err);
    });
};

const setTaskExecutor = (res) => {
  console.log('setexecutor');
  let lastexecutor;
  Tasks.findOne({ _id: res.taskId })
    .then((doc) => {
      if (!doc) throw 'Нет пользоватедя в БД';
      lastexecutor = doc.executor;
      return Users.update({ username: lastexecutor }, { $pull: { tasks: doc.id } });
    })
    .catch((err) => {
      console.log('ERROR', err);
    });

  Tasks.findOneAndUpdate({ _id: res.taskId }, { $set: { executor: res.username } })
    .then((doc) => {
      io.sockets.emit((Events.SOCKET_EMIT_GET_UPDATES));
      if (!(res.username === States.EXECUTOR)) {
        Event.emit((Events.EVENT_SET_EXECUTOR_BOT), res.telegramId, doc.id, doc.taskname, doc.taskcontent);
        return Users.findOneAndUpdate({ username: res.username }, { $addToSet: { tasks: doc.id } }, { new: true });
      }
    })
    .catch((err) => {
      console.log('ERROR', err);
    });
};

export default {
  addTask,
  getUser,
  getTasks,
  setTask,
  setTaskExecutor,
  setRole,
  delTask,
};
