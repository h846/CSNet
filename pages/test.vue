<template>
  <section>
    <h1>This is test Page</h1>
    <p>{{ msg }}</p>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      msg: 'Hi!',
    };
  },
  mounted() {
    axios
      .get('http://lejnet/api/json', { timeout: 99999999, file: 'csnet/announce.json' })
      .then(res => {
        this.msg = res.data;
      })
      .catch(err => {
        console.log('ERROR is ' + err.message);
      });
  },
};
</script>
