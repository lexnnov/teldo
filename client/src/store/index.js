import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import users from './modules/users';
import tasks from './modules/tasks';
import socket from './modules/socket';

Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    auth,
    users,
    tasks,
    socket,
  },
});
