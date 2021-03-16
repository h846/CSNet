<template>
  <section>
    <AppBar />
    <v-container>
      <v-row>
        <!-- Announcement -->
        <v-col cols="8">
          <v-sheet
            class="sheet overflow-y-auto"
            :rounded="true"
            elevation="3"
            height="100%"
          >
            <div id="announce" v-html="announce"></div>
          </v-sheet>
        </v-col>
        <!-- Hot Voice-->
        <v-col cols="4">
          <v-sheet>
            <v-card min-width="344" outlined>
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
            <v-card class="mt-5" min-width="344" outlined>
              <v-card-title>
                <span class="title-label">本日の入電予測</span>
              </v-card-title>
              <v-card-text>
                <span class="fcst-today">{{ Fcst.today }}</span>
                本
              </v-card-text>
              <v-card-title>
                <span class="title-label">昨日の入電結果</span>
              </v-card-title>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>入電数</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ Fcst.yesterday.actual }}本 (予測の{{
                      Fcst.yesterday.FcstRate
                    }}%)</v-list-item-subtitle
                  >
                </v-list-item-content>

                <v-list-item-content>
                  <v-list-item-title> 放棄数 </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ Fcst.yesterday.abd }}本 (入電の{{
                      Fcst.yesterday.AbdRate
                    }}%)
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>着信できなかった本数</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ Fcst.yesterday["裏abd"] }}本
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <!-- Link List Start -->
    <LinkList />
  </section>
</template>
<script>
import AppBar from "@/components/AppBar";
import LinkList from "@/components/LinkList";

import axios from "axios";
export default {
  name: "CSNetMainPage",

  components: {
    AppBar,
    LinkList,
  },

  data: () => ({
    announce: "",
    //Good Comment
    GC: {
      source: "",
      dept: "",
      operator: "",
      comment: "",
    },
    Fcst: {
      today: "",
      yesterday: {
        Fcst: 0,
        actual: 0,
        abd: 0,
        裏abd: 0,
        FcstRate: null,
        AbdRate: null,
      },
    },
  }),
  methods: {
    //当日判定
    areSameDate: function (d1, d2) {
      return (
        d1.getFullYear() == d2.getFullYear() &&
        d1.getMonth() == d2.getMonth() &&
        d1.getDate() == d2.getDate()
      );
    },
    //HTMLタグ除去
    delHTMLtag: function (str) {
      return str.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");
    },
  },
  created() {
    axios
      .all([
        axios.get(
          "http://lejnet/API/src/json/csnet-announce.json?date=" +
            new Date().getTime()
        ),
        axios.get(
          "http://lejnet/API/accdb?db=CSNet/common/HotVoice/data/DB/data.mdb&table=good_comment_csnethome"
        ),
        axios.get(
          "http://lejnet/API/accdb?db=CSNet/dataCenter/DB/Fcst/call/call_Result.accdb&table=data"
        ),
      ])
      .then(
        axios.spread((res1, res2, res3) => {
          //全体周知取得
          this.announce = res1.data.data[0].text;
          //グッドコメント取得。当日の日付のレコードを取得。
          let todaysComment = res2.data.find((val) => {
            let gcDate = new Date(val.GDdate);
            return this.areSameDate(gcDate, new Date());
          });
          //htmlタグを除去して割り当て
          this.GC.source = this.delHTMLtag(todaysComment["出所"]);
          this.GC.dept = this.delHTMLtag(todaysComment["部署"]);
          this.GC.operator = this.delHTMLtag(todaysComment["csr_name"]);
          this.GC.comment = this.delHTMLtag(todaysComment["comment"]);
          // 入電予測
          let callFcst = res3.data.find((val) => {
            let fcstDate = new Date(val["ｄａｔｅ"]); //全角　(；ﾟДﾟ)
            return this.areSameDate(fcstDate, new Date());
          });
          this.Fcst.today = callFcst["Fcst"];
          //昨日の入電結果
          let yesterdayResult = res3.data.find((val) => {
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
        })
      );
  },
};
</script>
<style lang="stylus" scoped>
deep-orange = #FF5722;

#announce /deep/ {
  p {
    margin: 0;
  }
}

.sheet {
  padding: 10px 20px;
  color: #000;
}

.ql-align-center {
  text-align: center;
}

.title-label {
  position: relative;
  padding: 0 0.5rem;
  background: deep-orange; // #a6d3c8;
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
  font-family: 'Roboto Mono', cursive;
  font-size: 2rem;
}
</style>