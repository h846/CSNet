<template>
  <v-container class="py-8 px-6" fluid>
    <Loader :loading="loading" />
    <v-row>
      <v-col cols="12">
        <v-card width="500">
          <v-subheader>ツールリンク編集</v-subheader>

          <v-list rounded>
            <v-list-item-group color="primary">
              <draggable v-model="category" :animation="200" @end="sortEnd()">
                <v-list-item
                  v-for="item in category"
                  :key="item.ID"
                  width="100%"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-arrow-right-drop-circle-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      <nuxt-link
                        :to="`toollinks/${item.name}?catid=${item.ID}`"
                      >
                        {{ item.name }}
                      </nuxt-link>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </draggable>
              <v-divider></v-divider>

              <v-list-item @click.stop="addDialog = true">
                <v-list-item-icon>
                  <v-icon class="deep-orange--text"
                    >mdi-plus-circle-outline</v-icon
                  >
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="deep-orange--text">
                    カテゴリ追加
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item @click.stop="dialog = true">
                <v-list-item-icon>
                  <v-icon class="light-blue--text"
                    >mdi-minus-circle-outline</v-icon
                  >
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="light-blue--text">
                    カテゴリ削除
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <CatAddDialog
      :catlist="category"
      :addDialog="addDialog"
      @closeAddDialog="addDialog = false"
    />
    <LinkListDialog
      :catlist="category"
      :dialog="dialog"
      @closeDialog="dialog = false"
    />
  </v-container>
</template>
<script>
import axios from "axios";
import draggable from "vuedraggable";

import Loader from "@/components/loader";
import CatAddDialog from "@/components/Admin/CatAddDialog";
import LinkListDialog from "@/components/Admin/LinkListDialog";

export default {
  components: {
    LinkListDialog,
    CatAddDialog,
    Loader,
    draggable
  },
  data() {
    return {
      loading: true,
      category: [],
      links: [],
      dialog: false,
      addDialog: false
    };
  },
  methods: {
    sortEnd() {
      this.category = this.category.map((val, index) => {
        val.position = index;
        return val;
      });

      for (const index in this.category) {
        let [position, id] = [
          this.category[index].position,
          this.category[index].ID
        ];
        axios.post("http://lejnet/API/accdb", {
          db: "CSNet/dataCenter/DB/Tool/tools_home.mdb",
          sql: `UPDATE \`category\` SET \`position\` = ${position} WHERE \`ID\` = ${id}`
        });
      }

      console.log(this.category);
    }
  },
  created() {
    axios
      .all([
        axios.get(
          "http://lejnet/API/accdb?db=CSNet/dataCenter/DB/Tool/tools_home.mdb&table=category" +
            `&date=${new Date().getTime()}` //同じURLだとキャッシュされてまうため、パラメータに現時刻を無駄に追加してキャッシュを無効化してん
        ),
        axios.get(
          "http://lejnet/API/accdb?db=CSNet/dataCenter/DB/Tool/tools_home.mdb&table=tool" +
            `&date=${new Date().getTime()}`
        )
      ])
      .then(
        axios.spread((res1, res2) => {
          // Sorting
          this.category = res1.data.sort(function(a, b) {
            if (a.position > b.position) {
              return 1;
            } else {
              return -1;
            }
          });
          this.links = res2.data;
          this.loading = false;
        })
      );
  }
};
</script>
<style lang="stylus" scoped></style>
