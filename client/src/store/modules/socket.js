// initial state
const state = {
  connect: false,
  isTasks: false,
  loading: true,
};

// getters
const getters = {
  connect: state => state.connect,
  isTasks: state => state.isTasks,
  loading: state => state.loading,
};

// actions
const actions = {
  SOCKET_CONNECT({ commit }, note) {
    commit('SOCKET_CONNECT', note);
  },
  ISTASKS({ commit }, note) {
    commit('ISTASKS', note);
  },
  LOADING({ commit }, note) {
    commit('LOADING', note);
  },
};

// mutations
const mutations = {
  SOCKET_CONNECT(state) {
    state.connect = true;
  },
  ISTASKS(state, payload) {
    state.isTasks = payload;
  },
  LOADING(state, payload) {
    state.loading = payload;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
