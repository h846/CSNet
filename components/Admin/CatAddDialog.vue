<template>
  <v-dialog v-model="addDialog" max-width="400" max-height="500" persistent>
    <v-card class="mx-auto">
      <v-card-title>カテゴリ追加</v-card-title>
      <v-card-text>
        <v-text-field
          label="カテゴリ名を入力"
          hint="追加したいカテゴリ名を入力してください"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn>カテゴリ追加</v-btn>
        <v-btn @click.stop="closeDialog">Close this dialog</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ["addDialog"],
  methods: {
    closeDialog() {
      this.$emit("closeAddDialog");
    },
  },
};
</script>