<template>
  <div>
    <Menu/>
    <router-view name="a"></router-view>
  </div>

</template>

<script>
  import Menu from '../../components/Menu/Menu';

  export default {
    name: 'Children',
    components: { Menu },
    data() {
      return {};
    },
    methods: {
      getTasks() {
        this.$socket.emit('getTasks');
      },

      getUsers() {
        this.$socket.emit('getUsers');
      },


    },

    computed: {},

    mounted() {
      setTimeout(() => {
        this.getTasks();
        this.getUsers();

      }, 1000);
    },


    socket: {

      events: {

        get_tasks(response) {
          if (response.data !== 'no_tasks') {
            this.$store.dispatch('ISTASKS', true);
          } else {
            this.$store.dispatch('ISTASKS', false);
          }
          this.$store.dispatch('LOADING', false);
          this.$store.dispatch('GETTASKS', response);

        },

        get_users(response) {

          this.$store.dispatch('DELUSERS');

          for (var key in response.data) {

            this.$store.dispatch('GETUSERS', {
              telegramId: response.data[key].telegramId,
              username: response.data[key].username,
              role: response.data[key].role
            });
          }

        },

        get_updates() {
          this.getTasks();
          this.getUsers();
        },

        connect() {

          this.$store.dispatch('SOCKET_CONNECT', true);


        },

      }

    }
  };
</script>

<style scoped>

  @import './View.scss';

</style>
