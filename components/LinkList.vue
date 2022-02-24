<template>
  <v-row>
    <v-col cols="12" sm="6" md="4" v-for="list in category" :key="list.id">
      <v-card min-width="250" height="300" class="overflow-y-auto mx-auto">
        <v-card-title class="link-title">{{ list.name }}</v-card-title>
        <ul>
          <li v-for="link in rtnLinks(list.ID)" :key="link.ID">
            <a v-if="link.category == list.ID" :href="link.Link" target="_blank">{{ link.Name }}</a>
          </li>
        </ul>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      isExpand: false,
    };
  },
  mounted() {
    this.$store.dispatch('getLinkListCategory');
    this.$store.dispatch('getLinkListItems');
  },
  computed: {
    category: function () {
      return this.$store.state.LinkListCategory;
    },
  },
  methods: {
    rtnLinks: function (catID) {
      let links = this.$store.state.LinkListItems;
      //Return items with the same category ID
      let linkList = links.filter((val) => {
        return catID == val.category;
      });
      // Sorting
      linkList.sort(function (a, b) {
        if (a.position > b.position) {
          return 1;
        } else {
          return -1;
        }
      });
      return linkList;
    },
  },
};
</script>
<style lang="stylus" scoped>

.link-title {
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  border-top: 2px solid #002566;
  border-bottom: 2px solid #002566;
  margin: 10px 30px;
  padding:0;
}
ul,li{
  list-style-type:none;
  padding:0;
  margin:0;
  margin-left: 20px;
}
a {
  text-decoration: none;
  color:#000 !important;
  font-weight: bold;
}

#flex-container{
  display : flex;
  flex-wrap : wrap;
  justify-content : space-between;
  .flex-child{
    margin-bottom 20px;
  }
}
</style>
