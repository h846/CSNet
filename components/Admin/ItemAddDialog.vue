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
      <p>追加成功しました!</p>
    </v-snackbar>
  </v-dialog>
</template>
<script>
import axios from 'axios';

export default {
  props: ['dialog', 'catid'],

  data: function () {
    return {
      item: { id: null, name: null, url: null },
      error: {
        is_name: false,
        msg_name: '',
        is_url: false,
        msg_url: '',
      },
      dbdata: null,
      snackbar: false,
    };
  },
  methods: {
    closeDialog() {
      // Reset to initial value
      this.error.is_name = false;
      this.error.msg_name = null;
      this.error.msg_url = null;
      this.error.is_url = false;
      this.item.id = null;
      this.item.name = null;
      this.item.url = null;

      this.$emit('closeAddDialog');
    },
    addItem: async function () {
      /*           *\
        VALIDATIONS  
      \*           */

      // アイテム名、URLの非空欄確認
      if (!this.item.name) {
        this.error.msg_name = 'アイテム名を入力してください';
        this.error.is_name = true;
        return;
      } else if (!this.item.url) {
        this.error.msg_url = 'URLを入力してください';
        this.error.is_url = true;
        return;
      }
      //url判定
      let regex = /^(https?:\/\/)/;
      if (!regex.test(this.item.url)) {
        this.error.msg_url = 'http(s)://から始まるURLを入力してください';
        this.error.is_url = true;
        return;
      } /* else {
        regex = /(\.hta)$/;
        if (regex.test(this.item.url)) {
          this.error.msg_url = "htaは指定できません。";
          this.error.is_url = true;
          return;
        }
      }*/
      //Get data from DB
      await axios
        .get('http://lejnet/API/accdb', {
          params: {
            db: 'CSNet/dataCenter/DB/Tool/tools_home.mdb',
            table: 'tool',
            date: new Date().getTime(),
          },
        })
        .then((res) => {
          this.dbdata = res.data;
        })
        .catch((err) => {
          return 'error occured';
        });
      //すでに同じアイテム名が存在していないか確認
      var self = this;
      let isExistItem = this.dbdata.some(function (val) {
        return val.Name == self.item.name;
      });
      //すでに同じURLが存在していないか確認
      let isExistUrl = this.dbdata.some(function (val) {
        console.log(val.Link, self.item.url);
        return val.Link == self.item.url;
      });
      //どちらも存在しなければ
      if (!isExistItem && !isExistUrl) {
        //ID生成
        let isExistID = true;
        // var ID = null;

        while (isExistID) {
          //4ケタのランダム値を生成
          self.item.id = this.randNum();
          isExistID = this.dbdata.some(function (val) {
            return val.ID == self.item.id;
          });
        }
      }

      await axios
        .post('http://lejnet/API/accdb', {
          db: 'CSNet/dataCenter/DB/Tool/tools_home.mdb',
          sql: `INSERT INTO tool(ID, Name, Link, category) VALUES (${this.item.id}, '${this.item.name}', '${this.item.url}', ${this.catid});`,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      this.snackbar = true;
      this.reset();
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
