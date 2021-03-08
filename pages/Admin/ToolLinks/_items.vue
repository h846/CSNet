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
    <!--Del Dialog -->
    <v-dialog v-model="delDialog" width="320">
      <v-card>
        <v-card-title>
          選択した項目を削除します。<br />
          よろしいですか？
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" outlined @click="deleteItem"> 削除 </v-btn>
          <v-btn color="error" outlined @click="delDialog = false">
            キャンセル
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Add Dialog-->
    <itemAddDialog
      :dialog="addDialog"
      :catid="catid"
      @closeAddDialog="addDialog = false"
    />
  </v-container>
</template>
<script>
import itemAddDialog from "@/components/Admin/ItemAddDailog";
import axios from "axios";
export default {
  components: {
    itemAddDialog,
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
  methods: {
    addItem: function () {},
    deleteItem: function () {
      for (let id of this.checkedItems) {
        let data = {
          sql: `DELETE FROM tool WHERE ID=${id}`,
          db: "CSNet/dataCenter/DB/Tool/tools_home.mdb",
        };
        axios
          .post("http://lejnet/API/accdb", data)
          .then((res) => {
            console.log(res.data, "success");
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.reset();
    },
    reset: function () {
      this.$router.go({ path: this.$router.currentRoute.path, force: true });
    },
  },
};
</script>
<style lang="stylus" scoped>
ul {
  list-style: none;
}
</style>
