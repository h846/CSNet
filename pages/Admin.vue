<template>
  <div>
    <NavDrawer />
    <nuxt-child />
  </div>
</template>
<script>
import NavDrawer from '@/components/Admin/NavDrawer';

export default {
  name: 'AdminPage',

  head() {
    return {
      title: 'Admin Page',
    };
  },

  components: {
    NavDrawer,
  },
  mounted() {
    if (this.$store.state.isAdmin == false) {
      this.$store.commit('setAdmin');
      this.$router.push('/');
    }
  },
};
</script>
<style lang="stylus" scoped></style>
