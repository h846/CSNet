<template>
  <v-dialog v-model="dialog" width="320">
    <v-card>
      <v-card-title>
        選択した項目を削除します。<br />
        よろしいですか？
      </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined @click="deleteItem"> 削除 </v-btn>
        <v-btn color="error" outlined @click="closeDialog()">
          キャンセル
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "axios";
export default {
  props: ["dialog", "checkedItems"],
  methods: {
    closeDialog: function () {
      this.$emit("closeDelDialog");
    },
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