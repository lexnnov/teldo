import Users from '../models/user.model';
import Tasks from '../models/task.model';
import helpers from '../helpers/helper';
import bot from '../config/botConfig';
import Event from '../config/Events';
import States from '../constants/states';
import Events from '../constants/events';

const start = `Команды для работы с ботом:
/tasks - показывает список выших задач,
/endtask << # >> - переносит выбранную задачу на ревью
/leave - удаляет вас иp базы данных разработчиков
`;

const options = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: 'My tasks', callback_data: '1' },
      ],
    ],
  }),
};

function userExistence(userId, textIfInBD, textIfOutBD) {
  Tasks.findOne({ telegramId: userId })
    .then((obj) => {
      if (obj) {
        bot.sendMessage(userId, textIfInBD);
      } else {
        bot.sendMessage(userId, textIfOutBD);
      }
    })
    .catch((err) => {
      console.log('Error', err);
    });
}

const addUser = (msg) => {
  console.log('addUser');
  Users.findOne({ telegramId: msg.from.id })
    .then((obj) => {
      if (obj) {
        bot.sendMessage(msg.from.id, 'Вы уже есть в базе!');
        bot.sendMessage(msg.from.id, start);
        throw 'Есть в базе!';
      }
      const user = new Users({
        telegramId: msg.from.id,
        username: msg.from.username,
        firstname: msg.from.first_name,
        lastname: msg.from.last_name,
        role: States.ROLE_DEVELOPER,
        tasks: [],
        password: '',
      });
      return Users.create(user);
    })
    .then(() => {
      Event.emit(Events.EVENT_UPDATE);
      bot.sendMessage(msg.from.id, 'Вы добавлены в базу!');
      bot.sendMessage(msg.from.id, start);
    })
    .catch((err) => {
      console.log('ERROR', err);
    });
};


const endTask = (msg, match) => {
  console.log('endTask');
  Users.findOne({ telegramId: msg.from.id })
    .then((user) => {
      if (!user) {
        bot.sendMessage(msg.from.id, 'Вас нет в базе!');
        throw 'Нет в базе!';
      }
      return user;
    })
    .then(() => {
      return Users.findOne({ telegramId: msg.from.id, tasks: { $in: match[1] } });
    })
    .then((doc) => {
      if (!doc) {
        bot.sendMessage(msg.from.id, 'У вас нет такой задачи');
        throw 'нет такой задачи';
      }
      return Tasks.findOneAndUpdate({ id: match[1] }, { $set: { state: 'review' } });
    })
    .then(() => {
      bot.sendMessage(msg.from.id, `Вы отправили задачу ${match[1]} на ревью`);
      Event.emit(Events.EVENT_UPDATE);
    })
    .catch((err) => {
      console.log('ERROR', err);
    });
};

const leaveFromBot = (msg) => {
  Users.deleteOne({ telegramId: msg.from.id })
    .then(() => {
      bot.sendMessage(msg.from.id, 'вы удалены из базы!');
    });

  Tasks.updateMany({ executer: msg.from.username }, { $set: { executer: 'нет исполнителя' } })
    .then((doc) => {
      if (!doc) throw 'нет такой задачи';
      console.log('doc', doc);
      Event.emit(Events.EVENT_UPDATE);
    })
    .catch((err) => {
      console.log('ERROR', err);
    });
};

const addTask = (msg, match) => {
  console.log('addTask');
  if (msg.from.id === 496402356) {
    const test = new Tasks({
      taskname: match[1],
      taskcontent: match[2],
      id: helpers.generateId(),
      state: States.STATE_TO_DO,
      executer: States.EXECUTOR,
      position: 0,
    });
    Tasks.create(test)
      .then((doc) => {
        console.log(doc);
        Event.emit(Events.EVENT_UPDATE);
      });
  } else {
    userExistence(msg.from.id, 'У вас нет прав на добавление задач', 'Вы не являетесь участником проекта');
  }
};

const getTasks = (msg) => {
  Users.findOne({ telegramId: msg.from.id })
    .then((user) => {
      if (!user) {
        bot.sendMessage(msg.from.id, 'Вас нет в базе!');
        throw 'нет в базе!';
      }
      console.log(user);
      bot.sendMessage(msg.from.id, 'Выберите любую кнопку:', options);
    })
    .catch((err) => {
      console.log('Error', err);
    });
};

const myTasks = (cb) => {
  if (cb.data === '1') {
    let taskk = '';
    Users.findOne({ telegramId: cb.from.id })
      .then((user) => {
        if (!user) {
          bot.sendMessage(cb.from.id, 'Вас нет в базе!');
          throw 'нет в базе!';
        }
        if (user.tasks.length === 0) {
          bot.sendMessage(cb.from.id, 'У вас нет задач!');
          throw 'Нет задач';
        }
        return user;
      })
      .then((obj) => {
        console.log('sdfsdfsdf', obj);
        return Tasks.find({ executer: obj.username });
      })
      .then((obj) => {
        obj.forEach((val) => {
          taskk = 'task #' + val.id + '\nname: ' + val.taskname + '\ncontent: ' + val.taskcontent;
          bot.sendMessage(cb.from.id, taskk, { parse_mode: 'Markdown' });
        });
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }
};


export default {
  addUser,
  endTask,
  leaveFromBot,
  addTask,
  getTasks,
  myTasks,
};
