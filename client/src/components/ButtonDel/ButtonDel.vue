<template>
  <v-btn @click="delTask" icon absolute right color="white" small>
    <v-icon small>clear</v-icon>
  </v-btn>
</template>

<script>
  export default {
    props: ['delItemId'],
    name: "ButtonDel",
    data() {
      return {};
    },
    methods: {


      delTask() {
        this.$socket.emit("delTask", {taskid: this.delItemId});
      },


    },
    socket: {

      events: {

      }
    }


  };
</script>

<style scoped>

</style>
