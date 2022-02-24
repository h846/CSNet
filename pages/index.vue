<template>
  <section>
    <Loader :loading="loading" />
    <AppBar />
    <v-container class="px-5">
      <v-row>
        <!-- Announcement -->
        <v-col cols="12" sm="7">
          <v-sheet class="sheet overflow-y-auto" :rounded="true" elevation="3" height="70%">
            <p class="title-label text-center">本日のお知らせ</p>
            <div id="announce" v-html="announce"></div>
          </v-sheet>
          <!-- Import Message-->
          <v-sheet class="sheet overflow-y-auto mt-3" :rounded="true" elevation="3" height="30%">
            <p class="title-label text-center">重要事項</p>
            <div id="importMsg" v-html="importMsg"></div>
          </v-sheet>
        </v-col>
        <!-- Hot Voice-->
        <v-col cols="12" sm="5">
          <v-sheet class="transparent">
            <v-card>
              <v-card-title class="mb-5">
                <span class="title-label">本日のグッドコメント</span>
                <v-spacer></v-spacer>
                <v-chip
                  color="primary"
                  small
                  pill
                  link
                  href="http://lejnet/CSNet/home/month_good.html"
                  target="_blank"
                >
                  過去分</v-chip
                ></v-card-title
              >

              <v-card-subtitle class="csr_info">
                <p class="gc-source">{{ goodComment['出所'] }}</p>
                <div class="amber--text text--darken-4">
                  <span class="mr-2">{{ goodComment['dept'] }}</span>
                  <span>{{ goodComment['csr_name'] }}</span>
                </div>
              </v-card-subtitle>
              <!-- Comment -->
              <v-card-text class="font-weight-black">{{ goodComment['comment'] }}</v-card-text>
            </v-card>
            <!-- Call Forecast -->
            <v-card class="mt-5">
              <v-card-title class="">
                <span class="title-label">本日の入電予測</span>
              </v-card-title>
              <v-card-text class="ml-4 pa-0">
                <span class="fcst-today">{{ callForecast.today['Fcst'] }}本</span>
              </v-card-text>
              <v-card-title>
                <span class="title-label">昨日の入電結果</span>
              </v-card-title>
              <v-row>
                <v-col cols="12" sm="6" class="pa-0">
                  <div class="ml-8 mb-3">
                    <p class="ma-0">入電数</p>
                    <span class="font-weight-bold">{{ callForecast.yesterday['actual'] }}本 </span>
                    <span>(予測の{{ forecastRate }}%)</span>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" class="pa-0">
                  <div class="ml-8 mb-3">
                    <p class="ma-0">放棄数</p>
                    <span class="font-weight-bold">{{ callForecast.yesterday.abd }}本</span>
                    <span>(入電の{{ abandanRate }}%)</span>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" class="pa-0">
                  <div class="ml-8 mb-3">
                    <p class="ma-0">着信できなかった本数</p>
                    <span class="font-weight-bold">{{ callForecast.yesterday['裏abd'] }}本</span>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-sheet>
        </v-col>
      </v-row>
      <!-- Cente Banners-->
      <Banners />
      <!-- Go to Search Tool -->
      <v-row justify="center">
        <v-btn color="warning" dark large class="mb-1" target="_blank" to="/toolSearch"
          >ツール検索</v-btn
        >
      </v-row>
      <!-- Link List -->
      <LinkList />
    </v-container>
  </section>
</template>
<script>
import Loader from '@/components/loader';
import AppBar from '@/components/AppBar';
import Banners from '@/components/HomeBanners';
import LinkList from '@/components/LinkList';

import axios from 'axios';

export default {
  name: 'CSNetMainPage',

  head() {
    return {
      title: 'Home',
    };
  },

  components: {
    AppBar,
    Banners,
    LinkList,
    Loader,
  },
  // Fetch: コンポーネントが作成される前に実行される
  async fetch({ store, params }) {
    //同日判定
    function areSameDate(d1, d2) {
      return (
        d1.getFullYear() == d2.getFullYear() &&
        d1.getMonth() == d2.getMonth() &&
        d1.getDate() == d2.getDate()
      );
    }
    //HTMLタグ除去
    function delHTMLtag(str) {
      return String(str).replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    }
    //Good Comment Data
    let gcData = await axios.get('http://lejnet/API/accdb', {
      params: {
        db: 'CSNet/common/HotVoice/data/DB/data.mdb',
        table: 'good_comment_csnethome',
      },
    });
    let gcDataToday = gcData.data.find((val) => {
      let gcDate = new Date(val.GDdate);
      return areSameDate(gcDate, new Date());
    });

    for (const key in gcDataToday) {
      gcDataToday[key] = delHTMLtag(gcDataToday[key]);
    }
    store.commit('setGoodComment', gcDataToday);

    //Call Forecast Data
    let cfData = await axios.get('http://lejnet/API/accdb', {
      params: {
        db: 'CSNet/dataCenter/DB/Fcst/call/call_Result.accdb',
        table: 'data',
      },
    });

    let today = cfData.data.find((val) => {
      let cfDate = new Date(val['ｄａｔｅ']); //全角(；´Д｀)
      return areSameDate(cfDate, new Date());
    });
    for (const key in today) {
      today[key] = delHTMLtag(today[key]);
    }

    let yesterday = cfData.data.find((val) => {
      let cfDate = new Date(val['ｄａｔｅ']); //全角(；´Д｀)
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return areSameDate(cfDate, yesterday);
    });

    for (const key in yesterday) {
      yesterday[key] = delHTMLtag(yesterday[key]);
    }

    store.commit('setCallForecast', { today: today, yesterday: yesterday });
  },

  data: () => ({
    loading: false,
    isAdmin: false,
    aryLen: 0, //Announce Data array
  }),
  methods: {
    //トップページのメッセージを定期更新。
    getAnnounceData: async function () {
      let res = await axios.get('http://lejnet/api/src/json/csnet/announce.json');
      if (this.aryLen < res.data.list.length && this.aryLen !== 0) {
        this.$store.dispatch('setAnnounceData', res.data);
        //console.log(this.$store.state.announce);
      }
      this.aryLen = res.data.list.length;
    },
  },
  computed: {
    announce: function () {
      return this.$store.state.announce;
    },
    importMsg: function () {
      return this.$store.state.importMsg;
    },
    goodComment: function () {
      return this.$store.state.goodComment;
    },
    callForecast: function () {
      return this.$store.state.callForecast;
    },
    forecastRate: function () {
      let fcst = parseInt(this.callForecast.yesterday.Fcst);
      let actual = parseInt(this.callForecast.yesterday.actual);
      return Math.round((fcst / actual) * 100);
    },
    abandanRate: function () {
      let abd = parseInt(this.callForecast.yesterday.abd);
      let actual = parseInt(this.callForecast.yesterday.actual);
      return Math.round((abd / actual) * 10000) / 100;
    },
  },
  mounted() {
    //this.loading = true;
    //ユーザー情報取得
    //this.$store.dispatch('getUserData');
    //全体周知メッセージ取得
    this.$store.dispatch('getAnnounceData');
    // 重要メッセージ取得
    this.$store.dispatch('getImportMsgData');
    //定期的に最新データがないかチェック
    setInterval(async () => {
      await this.getAnnounceData();
    }, 1000);
  },
};
</script>
<style lang="stylus">
.v-application p {
    margin:0;
}
#announce /deep/,
#importMsg /deep/ {
  padding: 20px;

  p {
    margin: 0;
  }

  .ql-align-center {
    text-align: center;
  }
}

.sheet {
  padding: 10px 20px;
  color: #000;
}

.title-label {
  color: #000;
  font-weight:bold;
  font-size: 1.5rem;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  padding: 2px 1px;
  margin-bottom:5px;
  //border-bottom: 2px solid #0d47a1;
}

.csr_info {
  p {
    margin: 0;
  }

  .gc-source {
    font-style: italic;
  }

  .gc-operator {
    font-weight: bold;
  }

  .gc-comment {

  }
}

.fcst-today {
  font-size: 2rem;
}
</style>
