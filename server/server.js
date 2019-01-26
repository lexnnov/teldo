import express from 'express';
import bot from './config/botConfig';
import mountSocketEvents from './events/socket';
import mountBotEvents from './events/bot';

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

mountSocketEvents(io);
mountBotEvents(bot);

app.use(express.static('../client/dist'));
app.get('/', function (req, res) {
  console.log('asdasdasd')
  res.sendFile('../client/dist/index.html');
  // logger.info('hello world');
//   res.send(yandex);
});


server.listen(3008);

export default io;
