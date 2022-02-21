<template>
  <v-container>
    <Loader :loading="loading" />
    <v-sheet class="my-3" width="650" rounded>
      <h1 class="ma-6 pt-3">{{ $route.params.items }}</h1>
      <v-row class="ml-3" align="center">
        <v-col cols="6">
          <v-btn :disabled="btnDisable" @click.stop="delDialog = true" color="error">
            <v-icon left>mdi-trash-can-outline</v-icon>
            チェックした項目を削除
          </v-btn>
        </v-col>

        <v-col cols="6">
          <v-btn @click="addDialog = true" color="success">
            <v-icon left>mdi-plus-circle-outline</v-icon>
            新しい項目を追加
          </v-btn>
        </v-col>
      </v-row>

      <v-list rounded>
        <v-list-item-group>
          <draggable v-model="data" :animation="200" @end="sortEnd()">
            <v-list-item v-for="item in data" :key="item.ID">
              <v-list-item-content>
                <v-checkbox
                  v-model="checkedItems"
                  :label="item.Name"
                  :value="item.ID"
                  dense
                  hide-details
                  style="font-weight: bold;"
                ></v-checkbox>
              </v-list-item-content>
              <v-btn :href="item.Link" target="_blank" color="primary" text>
                <v-icon left>mdi-open-in-new</v-icon>
                LINK
              </v-btn>
              <v-btn @click="editItem(item.ID)" color="blue-grey" text>
                <v-icon left>mdi-pencil-outline</v-icon>
                編集
              </v-btn>
            </v-list-item>
          </draggable>
        </v-list-item-group>
      </v-list>

      <v-divider class="my-10"></v-divider>
    </v-sheet>
    <!-- Delete Dialog -->
    <itemDelDialog
      :dialog="delDialog"
      :checkedItems="checkedItems"
      @closeDelDialog="delDialog = false"
    />
    <!-- Add Dialog-->
    <itemAddDialog :dialog="addDialog" :catid="catid" @closeAddDialog="addDialog = false" />
    <!-- Edit Dialog-->
    <itemEditDialog
      :dialog="editDialog"
      :link="link"
      @closeEditDialog="editDialog = false"
      @SuccessfulUpdate="itemUpdated"
    />
    <v-snackbar color="success" v-model="edSnackbar">
      更新完了しました！
    </v-snackbar>
  </v-container>
</template>
<script>
import Loader from '@/components/loader';
import itemAddDialog from '@/components/Admin/ItemAddDialog';
import itemDelDialog from '@/components/Admin/ItemDelDialog';
import itemEditDialog from '@/components/Admin/ItemEditDialog';

import axios from 'axios';
import draggable from 'vuedraggable';

export default {
  components: {
    itemAddDialog,
    itemDelDialog,
    itemEditDialog,
    Loader,
    draggable,
  },
  data() {
    return {
      data: [],
      catid: this.$route.query.catid,
      checkedItems: [],
      btnDisable: true,
      delDialog: false,
      addDialog: false,
      editDialog: false,
      edSnackbar: false,
      link: [{ Name: 'none' }],
      loading: true,
    };
  },
  created() {
    this.getItemData();
  },
  watch: {
    checkedItems: function(val) {
      if (val.length < 1) {
        this.btnDisable = true;
      } else {
        this.btnDisable = false;
      }
    },
  },
  methods: {
    async getItemData() {
      await axios
        .get('http://lejnet/API/accdb/', {
          params: {
            db: 'CSNet/dataCenter/DB/Tool/tools_home.mdb',
            table: 'tool',
            date: new Date().getTime(),
          },
        })
        .then(res => {
          // Sorting
          let data = res.data.sort(function(a, b) {
            if (a.position > b.position) {
              return 1;
            } else {
              return -1;
            }
          });
          this.data = data.filter(item => {
            return item.category == this.catid;
          });
          console.log(this.data);
          this.loading = false;
        });
    },
    editItem(itemID) {
      this.link = this.data.filter(val => val.ID == itemID);
      //console.log(this.link, this.link[0].Name);
      this.editDialog = true;
    },
    itemUpdated() {
      this.getItemData();
      this.edSnackbar = true;
    },
    sortEnd() {
      console.log(this.data);
      this.data = this.data.map((val, index) => {
        val.position = index;
        return val;
      });

      for (const index in this.data) {
        let [position, id] = [this.data[index].position, this.data[index].ID];
        axios.post('http://lejnet/API/accdb', {
          db: 'CSNet/dataCenter/DB/Tool/tools_home.mdb',
          sql: `UPDATE \`tool\` SET \`position\` = ${position} WHERE \`ID\` = ${id}`,
        });
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
h1 {
  font-size: 1.5rem;
  color: #333;
  border-bottom: 2px solid #002566;

  &:first-letter {
    color: #002566;
    margin-right: 0.1rem;
    font-size: 2rem;
  }
}

a {
  text-decoration :none;
}

ul {
  list-style: none;
}
</style>
