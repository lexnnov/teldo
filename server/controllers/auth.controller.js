import Users from '../models/user.model';
import Event from '../config/Events';
import Sockets from '../constants/events';
import States from '../constants/states';

const login = (data, socket) => {
  console.log(data);
  Users.findOne({ username: data.username }).then((user) => {
    if (user) {
      if (user.role === States.ROLE_ADMIN && data.password !== '') {
        Users.findOne({ username: data.username, password: data.password })
          .then((user) => {
            if (user) {
              console.log('user', user);
              socket.emit((Sockets.SOCKET_LOGIN), { data: 'admin' });
            } else {
              socket.emit((Sockets.SOCKET_LOGIN), { data: 'incorrect_password' });
            }
          });
      } else {
        if (user.role !== States.ROLE_ADMIN) {
          socket.emit((Sockets.SOCKET_LOGIN), { data: 'no_admin' });
        } else if (user.role === States.ROLE_ADMIN && data.password === '') {
          socket.emit((Sockets.SOCKET_LOGIN), { data: 'no_password' });
        }
      }
    } else {
      socket.emit((Sockets.SOCKET_LOGIN), { data: 'stranger' });
    }
  }).catch((err) => {
    console.log(err);
  });
};

const setPassword = (data, socket) => {
  console.log('setPassword');
  Users.findOne({ username: data.username })
    .then((user) => {
      console.log(user);
      if (user) {
        if (user.role === States.ROLE_ADMIN) {
          const randomstring = Math.random().toString(36).slice(-8);
          Users.findOneAndUpdate({ username: data.username }, { $set: { password: randomstring } })
            .then((user) => {
              socket.emit((Sockets.SOCKET_RES_PASSWORD), { data: 'admin' });
              Event.emit((Sockets.SOCKET_RES_PASSWORD), user.telegramId, randomstring);
            });
        } else {
          socket.emit((Sockets.SOCKET_RES_PASSWORD), { data: 'no_admin' });
        }
        console.log(user);
      } else {
        socket.emit((Sockets.SOCKET_RES_PASSWORD), { data: 'stranger' });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


export default {
  login,
  setPassword,
};
