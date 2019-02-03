import Vue from 'vue';
import Router from 'vue-router';
import TasksDashboard from '../views/TasksDashboard/TasksDashboard';
import Auth from '../views/Auth/Auth';
import Todo from '../views/TasksDashboard/TasksView/Todo';
import PageNotFound from '../views/NotFound/NotFound';
import UsersState from '../views/TasksDashboard/UsersStateView/UsersState';


Vue.use(Router);


export default new Router({
  routes: [
    {
      path: '/login',
      component: Auth,
    },
    {
      path: '/',
      component: TasksDashboard,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          components: { a: Todo },
        },
        {
          path: '/developers',
          components: { a: UsersState },
        },
      ],
    },
    {
      path: '*',
      component: PageNotFound,
    },
  ],
});
