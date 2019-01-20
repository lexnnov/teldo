import UserSchema from '../../models/user.model';
import TaskSchema from '../../models/task.model';
import botEvents from '../../controllers/bot.controller';
import Event from '../../config/Events';
import db from '../../config/mongo';

const Users = db.model('users', UserSchema);
const Tasks = db.model('tasks', TaskSchema);


const mountBotEvents = (bot) => {

  bot.onText(/\/start/, botEvents.addUser);

  bot.onText(/\/tasks/, botEvents.getTasks);

  bot.onText(/\/end (.+)/, botEvents.endTask);

  bot.onText(/\/leave/, botEvents.leaveFromBot);

  bot.onText(/\/addtask (.+); (.+)/, botEvents.addTask);


  Event.on('setExecuterBot', (id) => {
    bot.sendMessage(id, `У вас новая задача!`);
  });

  Event.on('resPassword', (id, password) => {
    bot.sendMessage(id, `Ваш пароль для входа ${password}`);
  });


  bot.on('callback_query', function (cb) {

    // console.log(cb)
    if (cb.data === '1') {
      let id = '';
      let taskName = '';
      let taskContent = '';
      Users.findOne({ telegramId: cb.from.id }, (err, taskObj) => {
        if (taskObj) {
          if (taskObj.tasks.length !== 0) {
            taskObj.tasks.forEach((task) => {

              Tasks.findOne({ id: task }).then((obj) => {
                return obj;
              }).then((obj) => {
                id = 'task #' + task + '\nname: ' + obj.taskname + '\ncontent: ' + obj.taskcontent;
                bot.sendMessage(cb.from.id, id, { parse_mode: 'Markdown' });
              });

            });
          }else {
            bot.sendMessage(cb.from.id, 'У вас нет задач!');
          }

        } else {
          bot.sendMessage(cb.from.id, 'Вас нет в базе!');
        }



      });

    } else if (cb.data === 'data 2') {
      bot.sendMessage(cb.from.id, 'все равно Иди в жопу');
    } else {
      bot.sendMessage(cb.from.id, 'да-да, все равно Иди в жопу');
    }
  });
};

export default mountBotEvents;
