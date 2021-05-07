<template>
  <section>
    <Loader :loading="loading" />
    <AppBar :isAdmin="isAdmin" />
    <v-container class="px-5">
      <v-row>
        <!-- Announcement -->
        <v-col cols="12" sm="7">
          <v-sheet
            class="sheet overflow-y-auto"
            :rounded="true"
            elevation="3"
            height="65%"
          >
            <h1>本日のお知らせ</h1>
            <div id="announce" v-html="announce"></div>
          </v-sheet>
          <!-- Import Message-->
          <v-sheet
            class="sheet overflow-y-auto mt-3"
            :rounded="true"
            elevation="3"
            height="35%"
          >
            <h1>重要事項</h1>
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
                >
                  過去分</v-chip
                ></v-card-title
              >
              <!-- CSR Info -->
              <v-card-subtitle class="csr_info">
                <p class="gc-source">{{ GC.source }}</p>
                <span class="mr-2">{{ GC.dept }}</span>
                <span class="gc-operator">{{ GC.operator }}</span>
              </v-card-subtitle>
              <!-- Comment -->
              <v-card-text class="gc-comment">{{ GC.comment }}</v-card-text>
            </v-card>
            <!-- Call Forecast -->
            <v-card class="mt-5">
              <v-card-title class="">
                <span class="title-label">本日の入電予測</span>
              </v-card-title>
              <v-card-text class="ml-4 pa-0">
                <span class="fcst-today">{{ Fcst.today }}本</span>
              </v-card-text>
              <v-card-title>
                <span class="title-label">昨日の入電結果</span>
              </v-card-title>
              <v-row>
                <v-col cols="12" sm="6" class="pa-0">
                  <div class="ml-8 mb-3">
                    <p class="ma-0">入電数</p>
                    <span class="font-weight-bold"
                      >{{ Fcst.yesterday.actual }}本
                    </span>
                    <span>(予測の{{ Fcst.yesterday.FcstRate }}%)</span>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" class="pa-0">
                  <div class="ml-8 mb-3">
                    <p class="ma-0">放棄数</p>
                    <span class="font-weight-bold"
                      >{{ Fcst.yesterday.abd }}本</span
                    >
                    <span>(入電の{{ Fcst.yesterday.AbdRate }}%)</span>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" class="pa-0">
                  <div class="ml-8 mb-3">
                    <p class="ma-0">着信できなかった本数</p>
                    <span class="font-weight-bold"
                      >{{ Fcst.yesterday["裏abd"] }}本</span
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-sheet>
        </v-col>
      </v-row>
      <!-- -->
      <Banners />
      <!-- Link List Start -->
      <LinkList />
    </v-container>
  </section>
</template>
<script>
import Loader from "@/components/loader";
import AppBar from "@/components/AppBar";
import Banners from "@/components/HomeBanners";
import LinkList from "@/components/LinkList";

import axios from "axios";
export default {
  name: "CSNetMainPage",

  head() {
    return {
      title: "Home"
    };
  },

  components: {
    AppBar,
    Banners,
    LinkList,
    Loader
  },

  data: () => ({
    loading: true,
    isAdmin: false,
    //Good Comment
    GC: {
      source: "",
      dept: "",
      operator: "",
      comment: ""
    },
    Fcst: {
      today: "",
      yesterday: {
        Fcst: 0,
        actual: 0,
        abd: 0,
        裏abd: 0,
        FcstRate: null,
        AbdRate: null
      }
    }
  }),
  methods: {
    //当日判定
    areSameDate: function(d1, d2) {
      return (
        d1.getFullYear() == d2.getFullYear() &&
        d1.getMonth() == d2.getMonth() &&
        d1.getDate() == d2.getDate()
      );
    },
    //HTMLタグ除去
    delHTMLtag: function(str) {
      return str.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");
    }
  },
  computed: {
    announce: function() {
      return this.$store.state.announce;
    },
    importMsg: function() {
      return this.$store.state.importMsg;
    }
  },
  created() {
    //全体周知メッセージ取得
    this.$store.dispatch("getAnnounceData");
    // 重要メッセージ取得
    this.$store.dispatch("getImportMsgData");
    //管理者判定
    //ユーザーデータ取得
    this.$store.dispatch("getUserData");
    let userID = this.$store.state.userData.id;
    let admins = this.$store.state.admins;
    this.isAdmin = admins.some(val => val == userID);
    this.$store.commit("setIsAdmin", this.isAdmin);
    //情報取得
    axios
      .all([
        //グッドコメント
        axios.get("http://lejnet/API/accdb", {
          params: {
            db: "CSNet/common/HotVoice/data/DB/data.mdb",
            table: "good_comment_csnethome"
          }
        }),
        //入電予測
        axios.get("http://lejnet/API/accdb", {
          params: {
            db: "CSNet/dataCenter/DB/Fcst/call/call_Result.accdb",
            table: "data"
          }
        })
      ])
      .then(
        axios.spread((goodComment, callForecast) => {
          //グッドコメント取得。当日の日付のレコードを取得。
          let todaysComment = goodComment.data.find(val => {
            let gcDate = new Date(val.GDdate);
            return this.areSameDate(gcDate, new Date());
          });
          //htmlタグを除去して割り当て
          this.GC.source = this.delHTMLtag(todaysComment["出所"]);
          this.GC.dept = this.delHTMLtag(todaysComment["部署"]);
          this.GC.operator = this.delHTMLtag(todaysComment["csr_name"]);
          this.GC.comment = this.delHTMLtag(todaysComment["comment"]);
          // 入電予測
          let callFcst = callForecast.data.find(val => {
            let fcstDate = new Date(val["ｄａｔｅ"]); //全角　(；ﾟДﾟ)
            return this.areSameDate(fcstDate, new Date());
          });
          this.Fcst.today = callFcst["Fcst"];
          //昨日の入電結果
          let yesterdayResult = callForecast.data.find(val => {
            let fcstDate = new Date(val["ｄａｔｅ"]); //全角　(；ﾟДﾟ)
            let yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            return this.areSameDate(fcstDate, yesterday);
          });
          this.Fcst.yesterday["Fcst"] = yesterdayResult["Fcst"];
          this.Fcst.yesterday["actual"] = yesterdayResult["actual"];
          this.Fcst.yesterday["abd"] = yesterdayResult["abd"];
          this.Fcst.yesterday["裏abd"] = yesterdayResult["裏abd"];
          //予測/実績 入電比率
          let yesterdayFcst = parseInt(this.Fcst.yesterday["Fcst"]);
          let yesterdayActual = parseInt(this.Fcst.yesterday["actual"]);
          let yesterdayAbd = parseInt(this.Fcst.yesterday["abd"]);
          this.Fcst.yesterday["FcstRate"] = Math.round(
            (yesterdayActual / yesterdayFcst) * 100
          );
          //放棄率
          this.Fcst.yesterday["AbdRate"] =
            Math.round((yesterdayAbd / yesterdayActual) * 10000) / 100;

          this.loading = false;
        })
      );
  }
};
</script>
<style lang="stylus" scoped>
deep-orange = #FF5722;

#announce /deep/, #importMsg /deep/{
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
  position: relative;
  padding: 0 0.5rem;
  background: deep-orange;
  color: white;
  font-size: 1rem;
  border-radius: 2px;

  &:before {
    position: absolute;
    content: '';
    top: 100%;
    left: 0;
    border: none;
    border-bottom: solid 6px transparent;
    border-right: solid 10px #BF360C;
  }
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
}

.fcst-today {
  font-size: 2rem;
}
</style>
