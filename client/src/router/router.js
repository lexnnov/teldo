import Vue from 'vue';
import Router from 'vue-router';
import View1 from '../Views/Children/Children';
import Login from '../components/Login/Login';
import Todo from '../components/ToDo/Todo';
import PageNotFound from '../components/notfound/NotFound';
import UsersState from '../components/UsersState/UsersState';


Vue.use(Router);


export default new Router({


  routes: [

    { path: '/login', component: Login },

    {
      path: '/',
      component: View1,
      meta: { requiresAuth: true },
      children: [

        {
          path: '',
          components: {
            a: Todo,
          },
        },

        {
          path: '/a',
          components: {
            a: UsersState,
          },
        },
      ],
    },

    { path: '*', component: PageNotFound },
  ],
});
