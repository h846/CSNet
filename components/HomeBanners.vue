<template>
  <v-sheet class="my-5 pa-5" min-width="450">
    <v-row>
      <v-col sm="4" md="3" cols="6" v-for="banner in banners" :key="banner.id">
        <v-card min-width="200" max-width="200" width="200" height="50">
          <a :href="banner.url" target="_blank">
            <v-img
              :src="`https://picsum.photos/200/50?random=${banner.id}`"
              class="grey lighten-2"
              height="50"
            >
              <p class="banner_title">{{ banner.title }}</p>
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </a>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
export default {
  data: function() {
    return {
      banners: [
        { id: "1", title: "強化週間", img: "", url: "http://lejnet/" },
        { id: "2", title: "WANTED", img: "", url: "" },
        { id: "3", title: "アパレル検定", img: "", url: "" },
        { id: "4", title: "CSチーム表", img: "", url: "" },
        { id: "5", title: "HR相談窓口", img: "", url: "" },
        { id: "6", title: "人事からのお知らせ", img: "", url: "" },
        { id: "7", title: "LANDS' END スピリッツ", img: "", url: "" }
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

a{
  text-decoration: none;
  display: inline-block;
  width: 100%;
  height: 100%;

}
</style>
