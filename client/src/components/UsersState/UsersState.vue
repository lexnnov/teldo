<template>
  <v-container v-if="rand1" align-center justify-center>


    <v-layout style="height: 50px " align-content-center align-center justify-center row
              v-for="item in $store.state.users.users.slice(1)">

      <v-flex sm3>
        <h4>{{item.username}}</h4>
      </v-flex>

      <v-flex sm3>
        <v-select :value="item.role" hide-details style="min-height: 40px;"
                  hide-selected height="1" outline :items="['Admin', 'Developer']" label="Роль"
                  v-on:change="setRole(item.telegramId, $event)"/>
      </v-flex>

    </v-layout>


  </v-container>
  <v-container v-else align-center justify-center>
    <v-layout align-center justify-center row row>

      <circle2/>

    </v-layout>
  </v-container>
</template>

<script>
  import { Circle2 } from 'vue-loading-spinner';

  export default {
    name: 'UsersState',

    components: {
      Circle2,
    },

    data() {
      return {};

    },

    computed: {
      rand1() {
        console.log(this.$store.state.users.usersname.length);

        if (this.$store.state.users.usersname.length !== 1) {
          console.log(true);
          return true;
        }
        console.log(false);
        return false; //ожидалось что app.rand будет давать случайное число
      }
    },

    methods: {

      setRole(id, event) {
        console.log(id, event);
        this.$socket.emit('setRole', { telegramId: id, role: event });
      }
    },
    mounted() {
      console.log(this.$parent);
    }
  };
</script>

<style scoped>

</style>
