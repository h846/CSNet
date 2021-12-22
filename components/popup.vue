<template> </template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      aryLen: 0,
      notifyMsg: 'CS-Netに新しいお知らせがあります！',
      options: {
        body: '',
        requireInteraction: true,
      },
    };
  },
  mounted() {
    //window.open('microsoft-edge:https://www.suzu6.net');
    // ブラウザーが通知APIに対応しているかどうかをチェックしましょう
    if (!('Notification' in window)) {
      alert('このブラウザーはデスクトップ通知に対応していません。');
    }
    // 通知の許可が既に得られていなければ許可を得る
    else if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    //1秒ごとにデータの更新状況をチェック
    setInterval(async () => {
      await this.notify();
    }, 1000);
  },
  methods: {
    notify: async function() {
      await axios.get('http://lejnet/api/src/json/csnet/announce.json').then(res => {
        if (this.aryLen < res.data.list.length && this.aryLen !== 0) {
          //メッセージ本文
          //this.options.body = res.data.list[0].data;
          let notification = new Notification(this.notifyMsg);
          notification.onclick = function(event) {
            window.open();
          };

          //トップページのメッセージも更新。
          this.$store.dispatch('setAnnounceData', res.data);
          console.log(this.$store.state.announce);
        }
        this.aryLen = res.data.list.length;
      });
    },
  },
};
</script>
