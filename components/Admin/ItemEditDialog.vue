<template>
  <v-dialog v-model="dialog" persistent width="500">
    <v-card>
      <v-card-title> リンクを編集します </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="表示名" :rules="[rules.required]" v-model="dispName" required>
          </v-text-field>
          <v-text-field label="URL" v-model="url" required> </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined @click="updateItem"> 更新 </v-btn>
        <v-btn color="error" outlined @click="closeDialog()"> キャンセル </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from 'axios';
export default {
  props: ['dialog', 'link'],
  data() {
    return {
      dispName: '',
      url: '',
      rules: {
        required: (value) => !!value || '何か入力してください',
        nothta: (value) => {
          const pattern = /(\.hta)$/;
          return !pattern.test(value) || 'htaは使用しないでください';
        },
      },
    };
  },
  created() {},
  watch: {
    link: function (val) {
      this.dispName = val[0].Name;
      this.url = val[0].Link;
      console.log(val[0]);
    },
  },
  methods: {
    closeDialog: function () {
      this.$emit('closeEditDialog');
    },
    updateItem() {
      axios
        .post('http://lejnet/API/accdb', {
          sql: `UPDATE tool SET Name = '${this.dispName}', Link = '${this.url}' WHERE ID = ${this.link[0].ID}`,
          db: 'CSNet/dataCenter/DB/Tool/tools_home.mdb',
        })
        .then((res) => {
          console.log('DONE');
        });
      this.closeDialog();
      this.$emit('SuccessfulUpdate');
    },
    /*
    deleteItem: function() {
      for (let id of this.checkedItems) {
        let data = {
          sql: `DELETE FROM tool WHERE ID=${id}`,
          db: "CSNet/dataCenter/DB/Tool/tools_home.mdb"
        };
        axios
          .post("http://lejnet/API/accdb", data)
          .then(res => {
            console.log(res.data, "success");
          })
          .catch(err => {
            console.log(err);
          });
      }
      this.reset();
    },*/
    reset: function () {
      this.$router.go({ path: this.$router.currentRoute.path, force: true });
    },
  },
};
</script>
