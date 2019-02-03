<template>
  <v-btn @click="delTask" icon absolute right color="white" small>
    <v-icon small>clear</v-icon>
  </v-btn>
</template>

<script>
  export default {
    props: ['delItemId'],
    name: "ButtonDel",

    methods: {
      delTask() {
        this.$socket.emit("delTask", {taskid: this.delItemId});
      },
    },
  };
</script>

<style scoped>

</style>
