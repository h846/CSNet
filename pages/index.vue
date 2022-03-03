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
              <!-- Comment-->
              <v-card-text class="font-weight-black">{{ goodComment.comment }}</v-card-text>
            </v-card>

            <!-- Call Forecast -->

            <v-card class="mt-5">
              <v-card-title class="">
                <span class="title-label">本日の入電予測</span>
              </v-card-title>
              <v-card-text class="ml-4 pa-0">
                <span class="fcst-today">{{ callForecast.today.Fcst }}本</span>
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
                    <span class="font-weight-bold">{{ callForecast.yesterday['abd'] }}本</span>
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
      <!-- Center Banners-->
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
  data: () => ({
    loading: false,
    isAdmin: false,
    aryLen: 0, //Announce Data array
    announce: null,
    importMsg: null,
    goodComment: {},
    callForecast: {
      today: {},
      yesterday: {},
    },
    forecastRate: null,
    abandanRate: null,
  }),
  computed: {},

  methods: {
    //トップページのメッセージを定期更新。
    getAnnounceData: async function () {
      let res = await axios.get('http://lejnet/api/src/json/csnet/announce.json');
      if (this.aryLen < res.data.list.length) {
        this.$store.dispatch('setAnnounceData', res.data);
      }
      this.aryLen = res.data.list.length;
    },
    //同日判定
    areSameDate(d1, d2) {
      return (
        d1.getFullYear() == d2.getFullYear() &&
        d1.getMonth() == d2.getMonth() &&
        d1.getDate() == d2.getDate()
      );
    },
    //HTMLタグ除去
    delHTMLtag(str) {
      return String(str).replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    },
  },
  mounted() {
    //this.loading = true;
    //ユーザー情報取得
    //this.$store.dispatch('getUserData');
    //全体周知メッセージ取得
    this.$store.dispatch('getAnnounceData').then(() => {
      this.announce = this.$store.state.announce;
    });
    //定期的に最新データがないかチェック
    setInterval(async () => {
      await this.getAnnounceData();
    }, 1000);
    // 重要メッセージ取得
    this.$store.dispatch('getImportMsgData').then(() => {
      this.importMsg = this.$store.state.importMsg;
    });
    //グッドコメント
    this.$store.dispatch('fetchGoodComment').then(() => {
      let gcData = JSON.parse(JSON.stringify(this.$store.state.goodComment));
      let gcDataToday = gcData.find((val) => {
        let gcDate = new Date(val.GDdate);
        return this.areSameDate(gcDate, new Date());
      });

      for (const key in gcDataToday) {
        gcDataToday[key] = this.delHTMLtag(gcDataToday[key]);
      }

      this.goodComment = gcDataToday;
    });
    //Call Forecast
    this.$store.dispatch('fetchCallForecast').then(() => {
      let cfData = JSON.parse(JSON.stringify(this.$store.state.callForecast));
      let today = cfData.find((val) => {
        let cfDate = new Date(val['ｄａｔｅ']); //全角(；´Д｀)
        return this.areSameDate(cfDate, new Date());
      });
      for (const key in today) {
        today[key] = this.delHTMLtag(today[key]);
      }

      let yesterday = cfData.find((val) => {
        let cfDate = new Date(val['ｄａｔｅ']); //全角(；´Д｀)
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return this.areSameDate(cfDate, yesterday);
      });
      for (const key in yesterday) {
        yesterday[key] = this.delHTMLtag(yesterday[key]);
      }

      this.callForecast.today = today;
      this.callForecast.yesterday = yesterday;
      let fcst = parseInt(yesterday.Fcst);
      let actual = parseInt(yesterday.actual);
      let abd = parseInt(yesterday.abd);
      this.forecastRate = Math.round((actual / fcst) * 100);
      this.abandanRate = Math.round((abd / actual) * 10000) / 100;
    });
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
