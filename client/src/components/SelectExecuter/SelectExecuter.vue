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

    methods: {
      setExecutor(taskId, username) {
        let telegramId = this.$store.getters.users.find((user)=> user.username === username ).telegramId
        this.$socket.emit('setExecutor', { username, taskId, telegramId });
      },
    }
  };
</script>

<style scoped>

</style>
