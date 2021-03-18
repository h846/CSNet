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

  data: () => ({
    admins: [
      "sehara",
      "hkinjo",
      "mtanaka",
      "myabe",
      "kiwaoka",
      "aishii",
      "myamagu",
      "hokobaya",
      "mtakaha",
      "hyashir",
      "",
    ],
  }),

  computed: {
    userinfo: function () {
      return this.$store.state.userData;
    },
  },

  mounted() {
    this.$store.dispatch("getUserData");
    let userID = this.$store.state.userData.id;
    let isAdmin = this.admins.some((val) => val == userID);
    if (!isAdmin) {
      this.$router.replace("/");
    }
  },
};
</script>
<style lang="stylus" scoped></style>