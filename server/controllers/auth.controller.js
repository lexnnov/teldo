import db from '../config/mongo';
import UserSchema from '../models/user.model';
import io from '../server';

const Event = require('../config/Events').eventBus;

const login = (data, socket) => {
  console.log(data);
  const Users = db.model('users', UserSchema);
  Users.findOne({username: data.username}).then((user) => {
    // console.log('sdfsdf', user)
    if (user.role === 'Admin' && data.password !== '') {

      Users.findOne({username: data.username, password: data.password}).then((user) => {



        if(user){
          console.log('sdfsdfdsf', user);
          socket.emit(('Login'), {data: 'admin'});
        }else{
          socket.emit(('Login'), {data: 'incorrect_password'});
        }

      });
    } else {
      if (user.role !== 'Admin'){
        socket.emit(('Login'), {data: 'no_admin'});
      } else if (user.role === 'Admin' && data.password === ''){
        socket.emit(('Login'), {data: 'no_password'});
      }
    }

    console.log(user);
  }).catch((err) => {
    socket.emit(('Login'), {data: 'stranger'})
  });
};

const setPassword = (data, socket) => {

  console.log(data)
  console.log(socket)

  const Users = db.model('users', UserSchema);
  Users.findOne({username: data.username}).then((user) => {
    if(user){
      if (user.role === 'Admin') {
        const randomstring = Math.random().toString(36).slice(-8);
        Users.findOneAndUpdate({username: data.username}, {$set: {password: randomstring}}).then((user) => {
          socket.emit(('resPassword'), {data: 'admin'});
          Event.emit(('resPassword'), user.telegramId, randomstring);
        });
      } else {
        socket.emit(('resPassword'), { data: 'no_admin' });
      }
      console.log(user);
    } else {
      socket.emit(('resPassword'), { data: 'stranger' });
    }
  })
};


export default {
  login,
  setPassword,
};
