<template>
  <v-container class="py-8 px-6" fluid>
    <!--title bar -->
    <v-toolbar dense elevation="1" class="mb-3">
      <v-toolbar-title>重要メッセージ編集ページ</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Confirm Current Announce Message-->
      <v-dialog v-model="currentImportDialog" max-width="750">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="warning" outlined v-bind="attrs" v-on="on">
            現在のメッセージ
          </v-btn>
        </template>
        <v-sheet>
          <div id="preview" v-html="currentImportMsg"></div>
        </v-sheet>
      </v-dialog>
    </v-toolbar>
    <!-- Editor -->
    <client-only placeholder="Loading Your Editor...">
      <v-sheet>
        <vue-editor v-model="content" />
      </v-sheet>
      <v-btn class="mt-3" block :loading="loading" color="warning" @click="dialog = true"
        >投 稿</v-btn
      >
    </client-only>
    <!--Comfirmation Dialog -->
    <v-dialog max-width="350" v-model="dialog" persistent>
      <v-card>
        <v-card-title> 更新してよろしいですか? </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="submit_msg"> 更新 </v-btn>
          <v-btn color="dark" @click="dialog = false"> キャンセル </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Snack Bar -->
    <v-snackbar v-model="snackbar" :timeout="timeout" color="success" elevation="2">
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
import axios from 'axios';

export default {
  data: () => ({
    content: '',
    loading: false,
    snackbar: false,
    dialog: false,
    currentImportDialog: false,
    currentImportMsg: '',
    timeout: 3000,
  }),
  created() {
    this.content = this.$store.state.importMsg;
    this.currentImportMsg = this.$store.state.importMsg;
  },
  methods: {
    submit_msg: function() {
      this.loading = true;
      this.dialog = false;
      axios
        .put('http://lejnet/API/json', {
          file: 'csnet/important-msg.json',
          data: this.content,
        })
        .then(
          function(res) {
            this.loading = false;
            this.snackbar = true;
            var self = this;
            setTimeout(function() {
              self.$router.push('/');
            }, 3000);
          }.bind(this)
        );
    },
  },
};
</script>
<style lang="stylus" scoped>
#preview /deep/ {
  padding: 20px;

  .ql-align-center {
    text-align: center;
  }
}
</style>
