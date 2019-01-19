<template>
  <v-select :key="keys" :value="value" hide-details style="min-height: 40px;"
            hide-selected height="1" outline
            :items="users" label="Исполнитель"
            v-on:change="setExecuter(keys, $event)"/>
</template>

<script>
  export default {
    name: 'executerSelect',
    props: ['users', 'keys', 'value'],
    data() {
      return {};
    },
    methods: {

      setExecuter(taskId, username) {
        // console.log(taskId, username)
        this.$socket.emit('setExecuter', { username, taskId });
      },

    }
  };
</script>

<style scoped>

</style>
