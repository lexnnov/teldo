import express from 'express';
import bot from './config/botConfig';
import mountSockets from './events/socket';
import mountBotEvents from './events/bot';

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

mountSockets(io);
mountBotEvents(bot);


server.listen(3008);

export default io;
