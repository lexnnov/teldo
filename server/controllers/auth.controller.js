import Users from '../models/user.model';
import Event from '../config/Events';
import Sockets from '../constants/events';
import States from '../constants/states';

const login = (data, socket) => {
  console.log(data);
  Users.findOne({ username: data.username })
    .then((user) => {
      if (!user) {
        socket.emit((Sockets.SOCKET_EMIT_LOGIN), { data: 'stranger' });
        throw 'stranger';
      }
      return user;
    })
    .then((user) => {
      if (user.role === States.ROLE_ADMIN && data.password !== '') {
        return Users.findOne({ username: data.username, password: data.password });
      }
      if (user.role !== States.ROLE_ADMIN) {
        socket.emit((Sockets.SOCKET_EMIT_LOGIN), { data: 'no_admin' });
        throw 'no_admin';
      }
      if (user.role === States.ROLE_ADMIN && data.password === '') {
        socket.emit((Sockets.SOCKET_EMIT_LOGIN), { data: 'no_password' });
        throw 'no_password';
      }
    })
    .then((user) => {
      if (!user) {
        socket.emit((Sockets.SOCKET_EMIT_LOGIN), { data: 'incorrect_password' });
        throw 'incorrect_password';
      }
      socket.emit((Sockets.SOCKET_EMIT_LOGIN), { data: 'admin' });
    })
    .catch((err) => {
      console.log('Error', err);
    });
};

const setPassword = (data, socket) => {
  console.log('setPassword');
  Users.findOne({ username: data.username })
    .then((user) => {
      if (!user) {
        socket.emit((Sockets.SOCKET_EMIT_RES_PASSWORD), { data: 'stranger' });
        throw 'No User in db!';
      }
      return user;
    })
    .then((user) => {
      if (user.role !== States.ROLE_ADMIN) {
        socket.emit((Sockets.SOCKET_EMIT_RES_PASSWORD), { data: 'no_admin' });
        throw 'No Admin!';
      }
      const pass = Math.random().toString(36).slice(-8);
      return Users.findOneAndUpdate({ username: user.username }, { $set: { password: pass } }, { new: true });
    })
    .then((user) => {
      socket.emit((Sockets.SOCKET_EMIT_RES_PASSWORD), { data: 'admin' });
      Event.emit((Sockets.EVENT_RESULT_PASSWORD), user.telegramId, user.password);
    })
    .catch((err) => {
      console.log('Error', err);
    });
};


export default {
  login,
  setPassword,
};
