<template>
  <v-container>
    <p>{{ $route.params.items }}</p>
    <v-row>
      <v-col>
        <v-btn
          :disabled="btnDisable"
          @click.stop="delDialog = true"
          color="error"
        >
          <v-icon left>mdi-minus-circle</v-icon>
          チェックした項目を削除
        </v-btn>
      </v-col>
      <v-col>
        <v-btn @click="addDialog = true" color="success">
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
    <!-- Delete Dialog -->
    <itemDelDialog
      :dialog="delDialog"
      :checkedItems="checkedItems"
      @closeDelDialog="delDialog = false"
    />
    <!-- Add Dialog-->
    <itemAddDialog
      :dialog="addDialog"
      :catid="catid"
      @closeAddDialog="addDialog = false"
    />
  </v-container>
</template>
<script>
import itemAddDialog from "@/components/Admin/ItemAddDialog";
import itemDelDialog from "@/components/Admin/ItemDelDialog";

import axios from "axios";
export default {
  components: {
    itemAddDialog,
    itemDelDialog,
  },
  data() {
    return {
      dbdata: [],
      catid: this.$route.query.catid,
      checkedItems: [],
      btnDisable: true,
      delDialog: false,
      addDialog: false,
    };
  },
  created() {
    axios
      .get("http://lejnet/API/accdb/", {
        params: {
          db: "CSNet/dataCenter/DB/Tool/tools_home.mdb",
          table: "tool",
          date: new Date().getTime(),
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
};
</script>
<style lang="stylus" scoped>
ul {
  list-style: none;
}
</style>
