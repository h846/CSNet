<template>
  <v-app-bar dense class="white">
    <v-toolbar-title>CS-Net</v-toolbar-title>

    <v-tabs optional>
      <v-tab href="http://lejnet/csnet/common/mail/index.htm" target="_blank">
        CS-Netメール
      </v-tab>
      <v-tab href="http://lejnet/csnet/userdata/index.htm" target="_blank">
        ユーザー設定
      </v-tab>
    </v-tabs>
    <v-toolbar-title>{{ greeting }}</v-toolbar-title>
    <v-btn v-if="isAdmin" to="Admin" nuxt color="blue darken-4" outlined
      >ADMIN</v-btn
    >
  </v-app-bar>
</template>
<script>
export default {
  props: ["isAdmin"],
  computed: {
    greeting: function() {
      let greet;
      let nowHour = new Date().getHours();
      if (nowHour >= 4 && nowHour < 11) {
        greet = "おはようございます。";
      } else if (nowHour >= 11 && nowHour < 18) {
        greet = "こんにちは。";
      } else if (nowHour >= 18 || (nowHour >= 0 && nowHour < 4)) {
        greet = "こんばんは。";
      }
      let userName = this.$store.state.userData;

      return greet + userName.name + "さん。";
    }
  }
};
</script>
<style lang="stylus" scoped>
a {
  text-decoration: none;
}

.v-toolbar__title {
  overflow: visible !important;
  margin-right: 50px !important;
}
</style>
