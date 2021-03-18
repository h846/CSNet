<template>
  <v-app id="inspire">
    <v-main class="bg">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
<style lamg="stylus">
@import url("https://fonts.googleapis.com/css2?family=Sawarabi+Gothic&family=Roboto+Mono&display=swap");

* {
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
}

#inspire {
  font-family: "Sawarabi Gothic", sans-serif;
}
</style>
