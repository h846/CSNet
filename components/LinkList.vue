<template>
  <draggable
    v-model="category"
    id="flex-container"
    :animation="200"
    @start="dragging = true"
    @end="dragging = false"
  >
    <div v-for="list in category" :key="list.id" class="flex-child">
      <v-card
        width="350"
        height="300"
        class="overflow-y-auto mx-auto"
        :class="{ dragging: dragging }"
      >
        <v-card-title class="link-title">{{ list.name }}</v-card-title>
        <ul>
          <li v-for="link in rtnLinks(list.ID)" :key="link.ID">
            <a
              v-if="link.category == list.ID"
              :href="link.Link"
              target="_blank"
              >{{ link.Name }}</a
            >
          </li>
        </ul>
      </v-card>
    </div>
  </draggable>
</template>
<script>
import axios from "axios";
import draggable from "vuedraggable";

export default {
  components: {
    draggable
  },
  data() {
    return {
      category: [],
      links: [],
      isExpand: false,
      dragging: false
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
  },
  watch: {
    dragging: function(state) {
      if (state) {
        console.log("DRAGGING....");
      } else {
        console.log("Stopping......");
      }
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
}

#flex-container{
  display : flex;
  flex-wrap : wrap;
  justify-content : space-between;
  .flex-child{
    margin-bottom 20px;
  }
}

.dragging{
  height : 50px !important;
  overflow-y: hidden !important;
}
</style>
