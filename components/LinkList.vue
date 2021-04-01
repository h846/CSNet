<template>
  <v-row justify="center">
    <v-col v-for="list in category" :key="list.id" cols="12" md="4" sm="6">
      <transition name="expand">
        <v-card height="300" class="overflow-y-auto mx-auto">
          <v-card-title class="link-title">{{ list.name }}</v-card-title>
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
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      category: [],
      links: [],
      isExpand: false
    };
  },
  created() {
    this.getLinkList();
  },
  methods: {
    getLinkList: async function() {
      await axios
        .all([
          axios.get("http://lejnet/API/accdb", {
            params: {
              db: "CSNet/dataCenter/DB/Tool/tools_home.mdb",
              table: "category"
            }
          }),
          axios.get("http://lejnet/API/accdb", {
            params: {
              db: "CSNet/dataCenter/DB/Tool/tools_home.mdb",
              table: "tool"
            }
          })
        ])
        .then(
          axios.spread((res1, res2) => {
            this.category = res1.data;
            this.links = res2.data;
            console.log("link list loaded.");
          })
        )
        .catch(err => {
          console.log(err);
        });
    },
    rtnLinks: function(catID) {
      //Return items with the same category ID
      let linkList = this.links.filter(val => {
        return catID == val.category;
      });
      return linkList;
    }
  }
};
</script>
<style lang="stylus" scoped>
.link-title {
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  border-top: 2px solid #002566;
  border-bottom: 2px solid #002566;
  margin: 0 30px;
  margin-top: 30px;
  padding: 5px 0;
}

a {
  text-decoration: none;
}
</style>
