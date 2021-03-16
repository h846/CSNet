<template>
  <div>
    <NavDrawer :userinfo="userinfo" />
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

  computed: {
    userinfo: function () {
      return this.$store.state.userData;
    },
  },

  mounted() {
    this.$store.dispatch("getUserData");
  },
};
</script>
<style lang="stylus" scoped></style>