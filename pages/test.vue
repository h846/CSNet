<template>
  <p>{{ users.id }}</p>
</template>
<script>
export default {
  computed: {
    users: function () {
      return this.$store.state.userData;
    },
  },
  mounted() {
    this.$store.dispatch("getUserData");
  },
};
</script>