import Users from '../../models/user.model';
import Tasks from '../../models/task.model';
import botEvents from '../../controllers/bot.controller';
import Event from '../../config/Events';
import Events from '../../constants/events';

const mountBotEvents = (bot) => {

  bot.onText(/\/start/, botEvents.addUser);

  bot.onText(/\/tasks/, botEvents.getTasks);

  bot.onText(/\/endtask (.+)/, botEvents.endTask);

  bot.onText(/\/leave/, botEvents.leaveFromBot);

  bot.onText(/\/addtask (.+); (.+)/, botEvents.addTask);


  Event.on(Events.EVENT_SET_EXICUTOR_BOT, (id, taskid, taskname, taskcontent) => {
    bot.sendMessage(id, 'У вас новая задача! \ntask #' + taskid + '\nname: ' + taskname + '\ncontent: ' + taskcontent);
  });

  Event.on(Events.EVENT_RESULT_PASSWORD, (id, password) => {
    bot.sendMessage(id, `Ваш пароль для входа ${password}`);
  });

  bot.on('callback_query', (cb) => botEvents.myTasks(cb));
};

export default mountBotEvents;
