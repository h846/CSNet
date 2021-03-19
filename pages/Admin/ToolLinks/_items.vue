<template>
  <v-container>
    <Loader :loading="loading" />
    <v-sheet class="my-3" width="500" rounded>
      <h1 class="ma-6 pt-3">{{ $route.params.items }}</h1>
      <v-row class="ml-3" align="center">
        <v-col cols="6">
          <v-btn
            :disabled="btnDisable"
            @click.stop="delDialog = true"
            color="error"
          >
            <v-icon left>mdi-minus-circle</v-icon>
            チェックした項目を削除
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn @click="addDialog = true" color="success">
            <v-icon left>mdi-plus-circle</v-icon>
            項目を追加
          </v-btn>
        </v-col>
      </v-row>

      <ul>
        <li v-for="item in itemList" :key="item.ID">
          <v-row align="center">
            <v-col cols="9">
              <v-checkbox
                v-model="checkedItems"
                :label="item.Name"
                :value="item.ID"
              ></v-checkbox>
            </v-col>
            <v-col cols="3">
              <a :href="item.Link" target="_blank">LINK</a>
            </v-col>
          </v-row>
        </li>
      </ul>
    </v-sheet>
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
import Loader from "@/components/loader";
import itemAddDialog from "@/components/Admin/ItemAddDialog";
import itemDelDialog from "@/components/Admin/ItemDelDialog";

import axios from "axios";
export default {
  components: {
    itemAddDialog,
    itemDelDialog,
    Loader,
  },
  data() {
    return {
      dbdata: [],
      catid: this.$route.query.catid,
      checkedItems: [],
      btnDisable: true,
      delDialog: false,
      addDialog: false,
      loading: true,
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
        this.loading = false;
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
h1 {
  font-size: 1.5rem;
  color: #333;
  border-bottom: 2px solid #002566;

  &:first-letter {
    color: #002566;
    margin-right: 0.1rem;
    font-size: 2rem;
  }
}

ul {
  list-style: none;
}
</style>
