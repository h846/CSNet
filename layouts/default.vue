<template>
  <v-app id="inspire">
    <v-main class="bg">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>
<style lamg="stylus">
* {
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
}

#inspire {
  font-family: "Helvetica Neue", "Helvetica", "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", "Arial", "Yu Gothic", "Meiryo", sans-serif;
  font-family: "Kosugi", sans-serif;
}
</style>
