<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-card>
        <v-card-title class="text-h5"> 検索キーワードを入力してください </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center">
              <v-col cols="7" class="pa-0">
                <v-text-field
                  v-model="searchWord"
                  @keyup.enter="search()"
                  dense
                  label="検索"
                  outlined
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-list>
              <v-list-item v-for="(i, k) in itemList" :key="k">
                <v-list-item-content v-show="showList">
                  <v-list-item-title>
                    <a :href="i.Link" target="_blank">{{ i.Name }}</a>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      itemList: [],
      orgList: [],
      dialog: false,
      showList: false,
      searchWord: null,
    };
  },
  mounted: function() {
    this.$store.dispatch('getLinkListItems').then(() => {
      this.itemList = this.orgList = this.$store.state.LinkListItems;
    });
  },
  methods: {
    search: function() {
      this.showList = true;
      this.itemList = this.orgList.filter(val => {
        return val.Name.includes(this.searchWord);
      });
    },
  },
};
</script>
<style scoped>
a {
  text-decoration: none;
  color: #000;
  font-weight: bold;
}
</style>
