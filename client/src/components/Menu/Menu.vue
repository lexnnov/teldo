<template>
  <v-container fluid grid-list-xl>
    <v-layout justify-space-between row wrap>
      <v-flex style="padding: 0">
        <v-btn depressed to="/">Tasks</v-btn>
        <v-btn depressed to="/developers">Developers</v-btn>
      </v-flex>
      <v-flex style="padding: 0">
        <Logout style="float: right"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Logout from '../Logout/Logout';

  export default {
    name: 'Menu',
    components: { Logout },
  };
</script>

<style>

</style>
