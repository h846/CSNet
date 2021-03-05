<template>
  <section>
    <v-dialog v-model="dialog" max-width="400" max-height="500" persistent>
      <v-card class="mx-auto">
        <v-list subheader flat>
          <v-subheader> カテゴリ削除 </v-subheader>
          <v-list-item-group>
            <v-list-item v-for="item in catlist" :key="item.Name">
              <v-list-item-title>
                <v-checkbox
                  class="mx-2"
                  width="100%"
                  line-height="100%"
                  v-model="selected"
                  :label="item.name"
                  :value="item.ID"
                ></v-checkbox>
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="delCat()">削除</v-btn>
          <v-btn color="primary" @click.stop="closeDialog">閉じる</v-btn>
        </v-card-actions>
        <!-- snack bar -->
        <v-snackbar v-model="snackbar">
          <p style="white-space: pre">{{ snackbarMsg }}</p>
          <v-btn @click="snackbar = false" color="pink" text>CLOSE</v-btn>
        </v-snackbar>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
import axios from "axios";

export default {
  props: ["catlist", "dialog"],
  data() {
    return {
      selected: [],
      snackbar: false,
      snackbarMsg: "",
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    }, // Reload
    reset: function () {
      this.$router.go({ path: this.$router.currentRoute.path, force: true });
    },
    delCat() {
      if (this.selected.length < 1) {
        this.snackbarMsg = "一つ以上選択してください";
        this.snackbar = true;
        return;
      }

      for (const itemID of this.selected) {
        axios
          .get(
            "http://lejnet/API/accdb?db=CSNet/dataCenter/DB/Tool/tools_home.mdb&table=tool"
          )
          .then((res) => {
            //カテゴリの中にアイテムがないか確認
            let valid = res.data.some((val) => val.category == itemID);
            //カテゴリにアイテムがなかったら削除
            if (valid == false) {
              let data = {
                sql: `DELETE FROM category WHERE ID=${itemID}`,
                db: "CSNet/dataCenter/DB/Tool/tools_home.mdb",
              };
              axios
                .post("http://lejnet/API/accdb", data)
                .then((res) => {
                  console.log(res.data);
                  this.reset();
                  this.snackbarMsg = "カテゴリを削除しました";
                  this.snackbar = true;
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              //カテゴリにアイテムがあった場合
              let cat = this.catlist.find((elm) => {
                return elm.ID == itemID;
              });

              this.snackbarMsg = `- ${cat.name} -
このカテゴリの中にアイテムがあります。
アイテムを削除してからカテゴリを削除してください`;
              this.snackbar = true;
              return;
            }
          });
      }
    },
  },
  created() {
    this.catlist.map((elm) => {
      return (elm["isChecked"] = false);
    });
    console.log(this.catlist);
  },
};
</script>
<style lang="stylus" scoped></style>
