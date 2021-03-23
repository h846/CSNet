<template>
  <v-app-bar dense class="amber darken-4" dark>
    <v-toolbar-title>CS-Net</v-toolbar-title>

    <v-tabs optional>
      <v-tab href="http://lejnet/csnet/common/mail/index.htm">
        CS-Netメール
      </v-tab>
      <v-tab href="http://lejnet/csnet/userdata/index.htm">
        ユーザー設定
      </v-tab>
    </v-tabs>

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

.v-toolbar__title {
  overflow: visible !important;
  margin-right: 50px !important;
}
</style>