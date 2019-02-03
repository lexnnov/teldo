<template>
    <v-btn outline depressed v-on:click="logoutSubmit" largest color="primary" dark>
      <v-icon left dark>exit_to_app</v-icon>
      Logout
    </v-btn>
</template>

<script>
  export default {
    name: "Logout",

    methods: {
      logoutSubmit() {
        this.$localStorage.remove('someBoolean');
        this.$store.dispatch('AUTH', false);
        this.$router.push('/login');
      }
    }
  };
</script>

<style scoped>

</style>
