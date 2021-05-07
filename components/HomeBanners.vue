<template>
  <v-sheet class="my-5 pa-5" min-width="450" elevation="3" rounded>
    <v-row>
      <v-col
        md="3"
        cols="6"
        v-for="banner in banners"
        :key="banner.id"
        style="text-align:center;"
      >
        <v-btn
          outlined
          color="indigo darken-4"
          width="230"
          :href="banner.url"
          target="_blank"
          ><v-icon left> {{ banner.icon }} </v-icon>{{ banner.title }}</v-btn
        >
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
export default {
  data: function() {
    return {
      banners: [
        {
          id: "1",
          title: "強化週間",
          icon: "mdi-arm-flex",
          url: "http://lejnet/"
        },
        { id: "2", title: "WANTED", icon: "mdi-account-clock", url: "" },
        { id: "3", title: "アパレル検定", icon: "mdi-hanger", url: "" },
        { id: "4", title: "CSチーム表", icon: "mdi-account-group", url: "" },
        { id: "5", title: "HR相談窓口", icon: "mdi-comment-question", url: "" },
        {
          id: "6",
          title: "人事からのお知らせ",
          icon: "mdi-bell-ring",
          url: ""
        },
        { id: "7", title: "LANDS' END スピリッツ", icon: "mdi-fire", url: "" },
        {
          id: "8",
          title: "JP Home Agent Team",
          icon: "mdi-microsoft-teams",
          url:
            "https://teams.microsoft.com/l/team/19%3a11bb535e6b0445ba823617385d2f0f66%40thread.tacv2/conversations?groupId=a3be0332-63b1-4b68-b6b3-7d0818fb1f7d&tenantId=682a61d2-c906-4fa3-a505-4c7cd3da5572"
        }
      ]
    };
  }
};
</script>
<style lang="stylus" scoped>
.banner_title {
  text-align:center;
  height:100%;
  line-height 50px;
  margin:0;
  color: #FFF !important;
  font-size: 1.1rem;
  letter-spacing:1px;
  text-shadow: black 1px 1px 0,
  black -1px -1px 0,
  black -1px 1px 0,
  black 1px -1px 0,
  black 0px 1px 0,
  black 0 -1px 0,
  black -1px 0 0,
  black 1px 0 0;
  /* 上、下 */
}
/*
a{
  text-decoration: none;
  display: inline-block;
  width: 100%;
  height: 100%;

}
*/
</style>
