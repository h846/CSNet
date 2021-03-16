<template>
  <v-navigation-drawer app permanent>
    <v-sheet color="grey lighten-4" class="pa-4">
      <h1>CS-Net Admin Page</h1>
      <div>ようこそ、{{ userinfo.name }}さん</div>
    </v-sheet>

    <v-divider></v-divider>

    <v-list>
      <v-list-item v-for="[icon, name, url] in links" :key="icon" link>
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title @click="transPage(name, url)">
            {{ name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ["userinfo"],
  data() {
    return {
      links: [
        ["mdi-message-bulleted", "全体周知編集", "/Admin"],
        ["mdi-hammer-screwdriver", "ツールリンク編集", "/Admin/toollinks"],
        ["mdi-home", "CS-Netホーム", "/"],
        [
          "mdi-email",
          "CS-Netメール",
          "http://lejnet/csnet/common/mail/index.htm",
        ],
        [
          "mdi-account-circle",
          "ユーザー設定",
          "http://lejnet/csnet/userdata/index.htm",
        ],
      ],
    };
  },
  methods: {
    transPage(name, url) {
      if (name == "CS-Netメール" || name == "ユーザー設定") {
        window.open(url, "_blank");
      } else {
        this.$router.push(url);
      }
    },
  },
};
</script>