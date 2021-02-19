<template>
  <v-container class="py-8 px-6" fluid>
    <v-row>
      <v-col cols="12">
        <v-card width="500">
          <v-subheader>ツールリンク編集</v-subheader>

          <v-list shaped>
            <v-list-item-group color="primary">
              <v-list-item v-for="item in category" :key="item.ID" width="100%">
                <v-list-item-icon>
                  <v-icon>mdi-arrow-right-drop-circle-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    <nuxt-link :to="'toollinks/' + item.name">
                      {{ item.name }}
                    </nuxt-link>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
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
    <LinkListDialog
      :catlist="category"
      :dialog="dialog"
      @closeDialog="dialog = false"
    />
  </v-container>
</template>
<script>
import axios from "axios";
import LinkListDialog from "@/components/Admin/LinkListDialog";

export default {
  components: {
    LinkListDialog,
  },
  data() {
    return {
      category: [],
      links: [],
      dialog: false,
    };
  },
  methods: {
    addCat: function () {},
  },
  created() {
    axios
      .all([
        axios.get(
          "http://lejnet/API/accdb?db=CSNet/dataCenter/DB/Tool/tools_home.mdb&table=category"
        ),
        axios.get(
          "http://lejnet/API/accdb?db=CSNet/dataCenter/DB/Tool/tools_home.mdb&table=tool"
        ),
      ])
      .then(
        axios.spread((res1, res2) => {
          this.category = res1.data;
          this.links = res2.data;
        })
      );
  },
};
</script>
<style lang="stylus" scoped></style>