<template>
  <v-app-bar dense class="amber darken-4" dark>
    <v-toolbar-title>CS-Net</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn v-if="isAdmin" to="Admin" nuxt color="yellow lighten-4" outlined
      >ADMIN</v-btn
    >
  </v-app-bar>
</template>
<script>
export default {
  props: ["isAdmin"],
};
</script>
<style lang="stylus" scoped>
a {
  text-decoration: none;
}
</style>