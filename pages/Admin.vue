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

  head() {
    return {
      title: "Admin Page"
    };
  },

  components: {
    NavDrawer
  },

  created() {
    //管理者か判定。直リンクを阻止。
    let isAdmin = this.$store.state.isAdmin;
    if (!isAdmin) {
      this.$router.replace("/");
    }
  }
};
</script>
<style lang="stylus" scoped></style>
