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
                <v-btn color="error" large>削除</v-btn>
                <v-btn @click.stop="closeDialog" color="primary" large
                  >閉じる</v-btn
                >
              </v-row>
            </v-list-item-action>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
export default {
  props: ["catlist", "dialog"],
  data() {
    return {
      selected: [],
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
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