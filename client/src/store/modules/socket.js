// initial state
const state = {
  connect: false,
};

// getters
const getters = {
  connect: state => state.connect,
};

// actions
const actions = {
  SOCKET_CONNECT({ commit }, note) {
    commit('SOCKET_CONNECT', note);
  },
};

// mutations
const mutations = {
  SOCKET_CONNECT(state) {
    state.connect = true;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
