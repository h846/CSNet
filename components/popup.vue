<template> </template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      popupMsg: '',
    };
  },
  mounted() {
    this.notify();
  },
  methods: {
    notify: function() {
      // ブラウザーが通知に対応しているかどうかをチェックしましょう
      if (!('Notification' in window)) {
        alert('このブラウザーはデスクトップ通知に対応していません。');
      }
      // 通知の許可が既に得られているかどうかをチェックしましょう
      else if (Notification.permission === 'granted') {
        // If it's okay let's create a notification
        var notification = new Notification('こんにちは！');
      }
      // そうでなければ、ユーザーに許可を求める必要があります
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function(permission) {
          // ユーザーが許可したら、通知を作成しましょう
          if (permission === 'granted') {
            var notification = new Notification('こんにちは！');
          }
        });
      } else {
        Notification.requestPermission();
      }
    },
    getNewMsg: async function() {
      //10分に1回新しいセッションに張り替える
      this.popupMsg = await axios.get('http://lejnet/api/json/', { timeout: 600000 });
      //自分自身をもう一度呼び出し
      this.getNewMsg();
    },
  },
};
</script>
