<template>
  <v-dialog v-model="dialog" max-width="400" max-height="500" persistent>
    <v-card class="mx-auto">
      <v-card-title>アイテムを追加</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            label="アイテム名を入力"
            hint="追加したいアイテム名を入力してください"
            v-model="item.name"
            outlined
            autofocus
            clearable
            :error="error.is_name"
            :error-messages="error.msg_name"
          ></v-text-field>

          <v-text-field
            label="URLを入力"
            hint="リンク先のアドレスを入力してください"
            v-model="item.url"
            outlined
            clearable
            :error="error.is_url"
            :error-messages="error.msg_url"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="success" @click="addItem">アイテム追加</v-btn>
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
  props: ["dialog"],

  data: function () {
    return {
      item: { id: null, naame: null, url: null },
      error: {
        is_name: false,
        msg_name: "",
        is_url: false,
        msg_url: "",
      },
      snackbar: false,
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeAddDialog");
    },
    addItem: function () {
      //console.log(this.item.name);
      if (!this.item.name) {
        this.error.msg_name = "アイテム名を入力してください";
        this.error.is_name = true;
        return;
      }
      if (!this.item.url) {
        this.error.msg_url = "URLを入力してください";
        this.error.is_url = true;
        return;
      }
      /*
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
      }*/
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
