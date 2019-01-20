import tasksHandler from '../../controllers/task.controller';
import authHandler from '../../controllers/auth.controller';
import Event from '../../config/Events';
// const Event = require('../Events').eventBus;

const mountSockets = (io) => {

  io.on(('connection'), (socket) => {

    console.log('connect');

    Event.on(('update'), () => {
      io.sockets.emit(('getUpdate'));
    });

    socket.on(('getTasks'), tasksHandler.getTasks);

    socket.on(('setRole'), tasksHandler.setRole);

    socket.on(('setTask'), tasksHandler.setTask);

    // socket.on('setTaskPosition');

    socket.on(('delTask'), tasksHandler.delTask);

    socket.on(('getUsers'), tasksHandler.getUser);

    socket.on(('addTask'), tasksHandler.addTask);

    socket.on(('setExecuter'), tasksHandler.setTaskExecuter);

    socket.on(('login'), data => authHandler.login(data, socket));

    socket.on(('reqPassword'), data => authHandler.setPassword(data, socket));

  });
};

export default mountSockets;
