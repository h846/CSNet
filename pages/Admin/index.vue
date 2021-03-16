<template>
  <v-container class="py-8 px-6" fluid>
    <v-row>
      <v-col cols="6">
        <h1>現在のメッセージ</h1>
        <div style="margin-bottom: 80px"></div>
        <v-sheet min-height="330" rounded style="padding: 10px">
          <div class="prv" v-html="announce"></div>
        </v-sheet>
      </v-col>
      <v-col cols="6">
        <h1>編集エリア</h1>
        <client-only placeholder="Loading Your Editor...">
          <vue-editor v-model="content" />
          <v-btn
            class="mt-3"
            block
            :loading="loading"
            color="primary"
            @click="dialog = true"
            >投 稿</v-btn
          >
        </client-only>
      </v-col>
    </v-row>
    <!--Comfirmation Dialog -->
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline"> 更新してよろしいですか? </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="submit_msg"> 更新 </v-btn>
          <v-btn color="green darken-1" text @click="dialog = false">
            キャンセル
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Snack Bar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="success"
      elevation="2"
    >
      更新完了しました！
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    content: "",
    announce: "",
    loading: false,
    snackbar: false,
    dialog: false,
    timeout: 3000,
  }),
  mounted() {
    this.getAnnounceData();
  },
  methods: {
    getAnnounceData: async function () {
      await axios
        .get(
          "http://lejnet/API/src/json/csnet-announce.json?date=" +
            new Date().getTime()
        )
        .then((res) => {
          this.announce = res.data.data[0].text;
          this.content = this.announce;
        });
    },
    submit_msg: function () {
      this.loading = true;
      this.dialog = false;
      axios
        .post("http://lejnet/API/json/announce", {
          announce: this.content,
        })
        .then(
          function (res) {
            this.loading = false;
            this.snackbar = true;
            console.log(res);
          }.bind(this)
        );
    },
  },
};
</script>
<style lang="stylus" scoped>
.prv /deep/ * {
  margin: 0;
}
</style>