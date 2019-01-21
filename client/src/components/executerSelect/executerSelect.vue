<template>
  <v-select :key="keys" :value="value" hide-details style="min-height: 40px;"
            hide-selected height="1" outline
            :items="users" label="Исполнитель"
            v-on:change="setExecutor(keys, $event)"/>
</template>

<script>
  export default {
    name: 'executerSelect',
    props: ['users', 'keys', 'value'],
    data() {
      return {};
    },
    methods: {

      setExecutor(taskId, username) {
        // console.log(taskId, username)
        this.$socket.emit('setExecutor', { username, taskId });
      },

    }
  };
</script>

<style scoped>

</style>
