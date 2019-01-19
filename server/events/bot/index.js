import mongoose from 'mongoose';
import UserSchema from '../../models/user.model';
import botEvents from '../../controllers/bot.controller';

const Event = require('../Events').eventBus;

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

      const db = mongoose.createConnection('mongodb://localhost/test');

      const Test = db.model('users', UserSchema);
      Test.findOne({ telegramId: cb.from.id }, (err, obj) => {
        console.log(obj);

        var id = '';
        for (var i = 0; i < obj.tasks.length; i++) {
          id += '#' + obj.tasks[i] + ' '; // or however you want to format it
        }
        console.log(id);
        bot.sendMessage(cb.from.id, id);

      });

    } else if (cb.data === 'data 2') {
      bot.sendMessage(cb.from.id, 'все равно Иди в жопу');
    } else {
      bot.sendMessage(cb.from.id, 'дф-да, все равно Иди в жопу');
    }
  });
}

export default mountBotEvents;
