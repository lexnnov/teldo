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
  Tasks.findOne({ telegramId: userId }).then((obj) => {
    if (obj) {
      bot.sendMessage(userId, textIfInBD);
    } else {
      bot.sendMessage(userId, textIfOutBD);
    }
  });
}

const addUser = (msg) => {
  console.log('addUser');
  console.log(msg);
  Users.findOne({ telegramId: msg.from.id })
    .then((err, obj) => {
      if (!obj) {
        console.log(obj);
        const user = new Users({
          telegramId: msg.from.id,
          username: msg.from.username,
          firstname: msg.from.first_name,
          lastname: msg.from.last_name,
          role: States.ROLE_DEVELOPER,
          tasks: [],
          password: '',
        });

        Users.create(user).then((doc) => {
          console.log(doc);
        });

        Event.emit(Events.EVENT_UPDATE);

        bot.sendMessage(msg.from.id, 'Вы добавлены в базу!');
        bot.sendMessage(msg.from.id, start);
      } else {
        bot.sendMessage(msg.from.id, 'Вы уже есть в базе!');
        bot.sendMessage(msg.from.id, start);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


const endTask = (msg, match) => {
  console.log('endTask');
  Users.findOne({ telegramId: msg.from.id }, (err, user) => {
    if (user) {
      Users.findOne({ telegramId: msg.from.id, tasks: { $in: match[1] } })
        .then((doc) => {
          if (doc) {
            Tasks.findOneAndUpdate({ id: match[1] }, { $set: { state: 'review' } })
              .then(() => {
                // bot.sendMessage(msg.from.id, `пользователь ${msg.from.id} отправил задачу ${match[1]} на ревью `);
                bot.sendMessage(msg.from.id, `Вы отправили задачу ${match[1]} на ревью`);
                Event.emit(Events.EVENT_UPDATE);
                console.log(Event);
              });
          } else {
            bot.sendMessage(msg.from.id, 'У вас нет такой задачи');
          }
        });
    } else {
      bot.sendMessage(msg.from.id, 'Вас нет в базе!');
    }
  });
};


const leaveFromBot = (msg) => {
  Users.deleteOne({ telegramId: msg.from.id })
    .then(() => {
      // console.log(username)
      bot.sendMessage(msg.from.id, 'вы удалены из базы!');
      Tasks.updateMany({ executer: msg.from.username }, { $set: { executer: 'нет исполнителя' } })
        .then((doc) => {
          console.log('doc', doc);
          Event.emit(Events.EVENT_UPDATE);
        });
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
      console.log(user);
      if (user) {
        bot.sendMessage(msg.from.id, 'Выберите любую кнопку:', options);
      } else {
        bot.sendMessage(msg.from.id, 'Вас нет в базе!');
      }
    });
};

const myTasks = (cb) => {
  if (cb.data === '1') {
    let id = '';
    Users.findOne({ telegramId: cb.from.id })
      .then((taskObj) => {
        if (taskObj) {
          if (taskObj.tasks.length !== 0) {
            taskObj.tasks.forEach((task) => {
              Tasks.findOne({ id: task })
                .then((obj) =>{
                  return obj;
                })
                .then((obj) => {
                  id = 'task #' + task + '\nname: ' + obj.taskname + '\ncontent: ' + obj.taskcontent;
                  bot.sendMessage(cb.from.id, id, { parse_mode: 'Markdown' });
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          } else {
            bot.sendMessage(cb.from.id, 'У вас нет задач!');
          }
        } else {
          bot.sendMessage(cb.from.id, 'Вас нет в базе!');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (cb.data === 'data 2') {
    bot.sendMessage(cb.from.id, 'все равно Иди в жопу');
  } else {
    bot.sendMessage(cb.from.id, 'да-да, все равно Иди в жопу');
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
