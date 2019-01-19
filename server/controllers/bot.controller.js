import db from '../config/mongo';
import UserSchema from '../models/user.model';
import TaskSchema from '../models/task.model';
import helpers from '../serverHelper';
import bot from '../config/botConfig';

const Event = require('../events/Events').eventBus;

const start =
  `Команды для работы с ботом:
/tasks - показывает список выших задач,
/endtask << # >> - переносит выбранную задачу на ревью
/leave - удаляет вас иp базы данных разработчиков
`;

const options = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: 'My tasks', callback_data: '1' },
        { text: 'Кнопка 2', callback_data: 'data 2' },
        { text: 'Кнопка 3', callback_data: 'text 3' },
      ],
    ],
  }),
};

function userExistence(userId, textIfInBD, textIfOutBD) {

  const Test = db.model('tests', UserSchema);
  Test.findOne({ telegramId: userId }, (err, obj) => {
    if (err) {
      console.error('err', err);
    }
    if (!(obj === null)) {
      bot.sendMessage(userId, textIfInBD);
    } else {
      bot.sendMessage(userId, textIfOutBD);
    }
  });
}

const addUser = (msg, match) => {
  console.log('addUser');
  const Test = db.model('users', UserSchema);
  Test.findOne({ telegramId: msg.chat.id }, (err, obj) => {
    if (!obj) {
      const test = new Test({
        telegramId: msg.chat.id,
        username: msg.chat.username,
        firstname: msg.chat.first_name,
        lastname: msg.chat.last_name,
        role: 'Developer',
        tasks: [],
        password: '',
      });

      Test.create(test, (err, doc) => {
        if (err) {
          return console.error(err);
        }
        console.log(doc);
      });

      Event.emit('update');

      bot.sendMessage(msg.chat.id, 'Вы добавлены в базу!');
      bot.sendMessage(msg.chat.id, start);
    } else {
      bot.sendMessage(msg.chat.id, 'Вы уже есть в базе!');
      bot.sendMessage(msg.chat.id, start);
    }
  });
};


const endTask = (msg, match) => {
  const taskid = match[1];
  const Users = db.model('users', UserSchema);
  const Tasks = db.model('tasks', TaskSchema);

  Users.findOne({ telegramId: msg.chat.id, 'tasks': { $in: match[1] } }, (err, doc) => {
    if (err) {
      console.log('Something wrong when updating data!');
    }

    if (doc) {
      Tasks.findOneAndUpdate({ id: match[1] }, { $set: { state: 'review' } }, (err, doc) => {
        if (err) {
          console.log('Something wrong when updating data!');
        }

        bot.sendMessage(msg.chat.id, `пользователь ${msg.chat.id} отправил задачу ${match[1]} на ревью `);
        Event.emit('update');
        console.log(Event);
      });
    }

    bot.sendMessage(msg.chat.id, `У вас нет такой задачи`);

  });

};

const leaveFromBot = (msg, match) => {

  const Test = db.model('users', UserSchema);
  Test.deleteOne({ telegramId: msg.from.id }, (err, obj) => {

    console.log('obj123123123', msg.from.username);

    // console.log(username)
    bot.sendMessage(msg.from.id, 'вы удалены из базы!');

    const Tasks = db.model('tasks', TaskSchema);
    Tasks.updateMany({ executer: msg.from.username }, { $set: { executer: 'нет исполнителя' } }, (err, doc) => {
      if (err) {
        console.log('Ssdfsdfsdomething wrong when updating data!');
      }
      console.log('sdfsdfsdfds', doc);
      Event.emit('update');
    });
  });
};

const addTask = (msg, match) => {
  console.log('addTask');
  console.log('msgsdfdsf', msg);
  if (msg.from.id === 496402356) {
    const Tasks = db.model('tasks', TaskSchema);


    const test = new Tasks({
      taskname: match[1],
      taskcontent: match[2],
      id: helpers.generateId(),
      state: 'to_do',
      executer: 'нет исполнителя',
      position: 0,
    });
    Tasks.create(test, (err, doc) => {
      if (err) {
        console.error(err);
      }
      console.log(doc);
      Event.emit('update');
    });
  } else {
    userExistence(msg.from.id, 'У вас нет прав на добавление задач', 'Вы не являетесь участником проекта');
  }
};

const getTasks = (msg, match) => {
  bot.sendMessage(msg.chat.id, 'Выберите любую кнопку:', options);
};


export default {
  addUser,
  endTask,
  leaveFromBot,
  addTask,
  getTasks,
};
