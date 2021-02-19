<template>
  <v-container>
    <v-row>
      <v-col v-for="list in category" :key="list.id" cols="4">
        <transition name="expand">
          <v-card height="300" class="overflow-y-auto ma-3">
            <v-card-title>{{ list.name }}</v-card-title>
            <v-list dense>
              <v-list-item v-for="link in rtnLinks(list.ID)" :key="link.ID">
                <v-list-item-content v-if="link.category == list.ID">
                  <v-list-item-title>
                    <a :href="link.Link" target="_blank">
                      {{ link.Name }}
                    </a>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      category: [],
      links: [],
      isExpand: false,
    };
  },
  created() {
    axios
      .all([
        axios.get(
          "http://lejnet/API/accdb?db=CSNet/dataCenter/DB/Tool/tools_home.mdb&table=category"
        ),
        axios.get(
          "http://lejnet/API/accdb?db=CSNet/dataCenter/DB/Tool/tools_home.mdb&table=tool"
        ),
      ])
      .then(
        axios.spread((res1, res2) => {
          this.category = res1.data;
          this.links = res2.data;
        })
      );
  },
  methods: {
    rtnLinks: function (catID) {
      //Return items with the same category ID
      let linkList = this.links.filter((val) => {
        return catID == val.category;
      });
      return linkList;
    },
  },
};
</script>
<style scoped>
a {
  text-decoration: none;
}
</style>