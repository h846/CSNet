<template>
  <div>
    <NavDrawer />
    <nuxt-child />
  </div>
</template>
<script>
import NavDrawer from "@/components/Admin/NavDrawer";

export default {
  name: "AdminPage",

  components: {
    NavDrawer,
  },

  data: () => ({}),
};
</script>
<style lang="stylus" scoped></style>