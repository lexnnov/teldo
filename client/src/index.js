import Vue from 'vue';
import VueWebsocket from 'vue-websocket';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate';
import VueLocalStorage from 'vue-localstorage';
import Notifications from 'vue-notification';
import router from './router/router';
import AppMain from './views/AppMain/AppMain';
import store from './store';

Vue.use(VeeValidate);
Vue.use(Vuetify);
Vue.use(VueLocalStorage);
Vue.use(Notifications);


router.beforeEach((to, from, next) => {
  console.log(Vue.localStorage.get('someBoolean'));
  console.log(store.state.auth.isAuth)
  if (!Vue.localStorage.get('someBoolean')) {

    if (to.matched.some(record => record.meta.requiresAuth) && !store.state.auth.isAuth) {
      console.log(Vue.localStorage.get('someBoolean'));

      next({ path: '/login' });
    } else {
      next();
    }
  } else {
    store.state.auth.isAuth = true;
    next();
  }
});

Vue.use(VueWebsocket, 'localhost:3008', { transports: ['websocket'] } );

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  el: '#app',
  render: h => h(AppMain),
});
