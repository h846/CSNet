<template>
  <v-dialog v-model="addDialog" max-width="400" max-height="500" persistent>
    <v-card class="mx-auto">
      <v-card-title>カテゴリ追加</v-card-title>
      <v-card-text>
        <v-text-field
          label="カテゴリ名を入力"
          hint="追加したいカテゴリ名を入力してください"
          v-model="catname"
          outlined
          full-width
          autofocus
          clearable
          :error="error"
          :error-messages="errorMsg"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="success" @click="isExistCategory">カテゴリ追加</v-btn>
        <v-btn @click.stop="closeDialog">キャンセル</v-btn>
      </v-card-actions>
    </v-card>
    <!-- SNACK BAR -->
    <v-snackbar v-model="snackbar">
      <p>更新完了しました!</p>
    </v-snackbar>
  </v-dialog>
</template>
<script>
import axios from "axios";

export default {
  props: ["addDialog", "catlist"],
  data: function () {
    return {
      catname: "",
      error: false,
      errorMsg: "",
      snackbar: false,
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeAddDialog");
    },
    isExistCategory: function () {
      if (!this.catname) {
        this.errorMsg = "何か文字を入力してください";
        this.error = true;
        return;
      }
      //すでに同じカテゴリが存在していないかチェック
      let isExist = this.catlist.some((val) => val.name == this.catname);
      if (!isExist) {
        console.log("All Pass!!");
        //ID生成
        let isIDExist = true;
        //重複チェック
        while (isIDExist) {
          var ID = this.randNum();
          isIDExist = this.catlist.some((val) => val.ID == ID);
        }

        let data = {
          sql: `INSERT INTO category(ID, name) VALUES (${ID}, '${this.catname}')`,
          db: "CSNet/dataCenter/DB/Tool/tools_home.mdb",
        };

        axios
          .post("http://lejnet/API/accdb", data)
          .then((res) => {
            console.log(res.data);
            this.snackbar = true;
            this.reset();
          })
          .catch((err) => {
            console.log(err);
          });
        console.log(ID);
      } else {
        console.log("Error!");
        this.errorMsg = "同名のカテゴリがすでに存在しています";
        this.error = true;
        return;
      }
    },
    randNum: function () {
      return Math.floor(Math.random() * 10000);
    },
    reset: function () {
      this.$router.go({ path: this.$router.currentRoute.path, force: true });
    },
  },
};
</script>