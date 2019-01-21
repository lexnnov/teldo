import tasksHandler from '../../controllers/task.controller';
import authHandler from '../../controllers/auth.controller';
import Event from '../../config/Events';
import Events from '../../constants/events';

const mountSockets = (io) => {

  io.on(Events.SOCKET_ON_CONNECTION, (socket) => {

    Event.on(Events.EVENT_UPDATE, () => {
      io.sockets.emit((Events.SOCKET_EMIT_GET_UPDATES));
    });

    socket.on(Events.SOCKET_ON_GET_TASKS, tasksHandler.getTasks);

    socket.on(Events.SOCKET_ON_SET_ROLE, tasksHandler.setRole);

    socket.on(Events.SOCKET_ON_SET_TASK, tasksHandler.setTask);

    socket.on(Events.SOCKET_ON_DEL_TASK, tasksHandler.delTask);

    socket.on(Events.SOCKET_ON_GET_USERS, tasksHandler.getUser);

    socket.on(Events.SOCKET_ON_ADD_TASK, tasksHandler.addTask);

    socket.on(Events.SOCKET_ON_SET_EXECUTOR, tasksHandler.setTaskExecuter);

    socket.on(Events.SOCKET_ON_LOGIN, data => authHandler.login(data, socket));

    socket.on(Events.SOCKET_ON_REQ_PASSWORD, data => authHandler.setPassword(data, socket));

    // socket.on('setTaskPosition');

  });
};

export default mountSockets;
