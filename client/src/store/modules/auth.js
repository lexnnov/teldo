
// initial state
const state = {
  isAuth: false,
  login: '',
  password: '',
};

// getters
const getters = {
  isAuth: state => state.isAuth,
  login: state => state.login,
  password: state => state.password,
};

// actions
const actions = {
  AUTH({ commit }, note) {
    commit('AUTH', note);
  },
  LOGIN({ commit }, note) {
    commit('LOGIN', note);
  },
  PASSWORD({ commit }, note) {
    commit('PASSWORD', note);
  },
};

// mutations
const mutations = {
  AUTH(state, playoad) {
    state.isAuth = playoad;
  },
  LOGIN(state, playoad) {
    state.login = playoad;
  },
  PASSWORD(state, playoad) {
    state.password = playoad;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
