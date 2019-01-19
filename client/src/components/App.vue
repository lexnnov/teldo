<style>
  html{
    overflow-y: auto;
  }

</style>


<template>
    <v-app>

        <Main/>
    </v-app>

</template>

<script>
  import Main from '../Views/Main/Main'

    export default {
        name: 'App',
      components: {Main}

    }
</script>
