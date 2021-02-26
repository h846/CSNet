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

            <v-list-item-action style="width: 90%">
              <v-row align="center" justify="space-around">
                <v-btn color="error" large @click="delCat()">削除</v-btn>
                <v-btn @click.stop="closeDialog" color="primary" large
                  >閉じる</v-btn
                >
              </v-row>
            </v-list-item-action>
          </v-list-item-group>
        </v-list>
        <!-- snack bar -->
        <v-snackbar v-model="snackbar" :timeout="snackbarTO">
          <p>
            カテゴリの中にアイテムがあります。<br />アイテムを削除してからカテゴリを削除してください<br />
            <strong>{{ snackbarMsg }}</strong>
          </p>
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
      snackbarTO: 2000,
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    delCat() {
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
              // ここから
              console.log("it will be deleted!!");
            } else {
              //カテゴリにアイテムがあった場合
              let cat = this.catlist.find((elm) => {
                console.log(elm.ID);
                return elm.ID == itemID;
              });

              this.snackbarMsg = cat.name;
              this.snackbar = true;
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