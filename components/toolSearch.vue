<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on"> キーワード検索 </v-btn>
      </template>
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
                    <a :href="i.Link">{{ i.Name }}</a>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
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
  mounted: function () {
    this.$store.dispatch('getLinkListItems').then(() => {
      this.itemList = this.orgList = this.$store.state.LinkListItems;
      //console.log('itemlist is' + this.itemList);
    });
  },
  methods: {
    search: function () {
      this.showList = true;
      this.itemList = this.orgList.filter((val) => {
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
