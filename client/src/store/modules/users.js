// initial state
const state = {
  users: [{ username: 'нет исполнителя', role: 'no_role' }],
  usersname: ['нет исполнителя'],
};

// getters
const getters = {
  users: state => state.users,
};

// actions
const actions = {
  GETUSERS({ commit }, note) {
    commit('GETUSERS', note);
  },
  DELUSERS({ commit }, note) {
    commit('DELUSERS', note);
  },
};

// mutations
const mutations = {
  GETUSERS(state, playoad) {
    state.users.push({ telegramId: playoad.telegramId, username: playoad.username, role: playoad.role });
    state.usersname.push(playoad.username);
  },
  DELUSERS(state) {
    state.users = [{ username: 'нет исполнителя', role: 'no_role' }];
    state.usersname = ['нет исполнителя'];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
