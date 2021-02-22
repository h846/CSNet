<template>
  <v-container>
    <p>{{ $route.params.items }}</p>
    <v-row>
      <v-col>
        <v-btn :disabled="btnDisable" @click="deleteItem" color="error">
          <v-icon left>mdi-minus-circle</v-icon>
          チェックした項目を削除
        </v-btn>
      </v-col>
      <v-col>
        <v-btn color="success">
          <v-icon left>mdi-plus-circle</v-icon>
          項目を追加
        </v-btn>
      </v-col>
    </v-row>
    <ul>
      <li v-for="item in itemList" :key="item.ID">
        <v-row align="center" justify="start">
          <v-col>
            <v-checkbox
              v-model="checkedItems"
              :label="item.Name"
              :value="item.ID"
            ></v-checkbox>
          </v-col>
          <v-col>
            <a :href="item.Link" target="_blank">LINK</a>
          </v-col>
        </v-row>
      </li>
    </ul>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      dbdata: [],
      catid: this.$route.query.catid,
      checkedItems: [],
      btnDisable: true,
    };
  },
  created() {
    let res = axios
      .get("http://lejnet/API/accdb/", {
        params: {
          db: "CSNet/dataCenter/DB/Tool/tools_home.mdb",
          table: "tool",
        },
      })
      .then((res) => {
        this.dbdata = res.data;
      });
  },
  computed: {
    itemList: function () {
      return this.dbdata.filter((item) => {
        return item.category == this.catid;
      });
    },
  },
  watch: {
    checkedItems: function (val) {
      if (val.length < 1) {
        this.btnDisable = true;
      } else {
        this.btnDisable = false;
      }
    },
  },
  methods: {
    deleteItem: function () {
      alert(this.checkedItems);
    },
  },
};
</script>
<style lang="stylus" scoped>
ul {
  list-style: none;
}
</style>
