// initial state

const socket = require('vue-websocket');

const state = {

  to_do: [],
  in_progress: [],
  review: [],
  in_build: [],

};

// getters
const getters = {
  tasks: state => state,
};

// actions
const actions = {
  GETTASKS({ commit }, note) {
    commit('GETTASKS', note);
  },
};

// mutations
const mutations = {

  GETTASKS(state, playoad) {
    if(playoad.data !== 'no_tasks'){

      console.log('tasks');
      state.to_do = [];
      state.in_progress = [];
      state.review = [];
      state.in_build = [];

      // console.log('response:', response)

      for (var key in playoad.data) {
        state[playoad.data[key].state].push({
          id: playoad.data[key]._id,
          tasknumber: playoad.data[key].id,
          taskname: playoad.data[key].taskname,
          taskcontent: playoad.data[key].taskcontent,
          executer: playoad.data[key].executor,
          position: playoad.data[key].position,
          state: playoad.data[key].state,

        });
      }

      Array.prototype.sortBy = function (p) {
        return this.slice(0).sort(function (a, b) {

          return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
        });
      };

      state.to_do = state.to_do.sortBy('position');
      state.in_progress = state.in_progress.sortBy('position');
      state.review = state.review.sortBy('position');
      state.in_build = state.in_build.sortBy('position');
      console.log('get tasks');

    }else if(playoad.data === 'no_tasks'){
      state.to_do = [];
      state.in_progress = [];
      state.review = [];
      state.in_build = [];
    }




  }


};

export default {
  state,
  getters,
  actions,
  mutations,
};
