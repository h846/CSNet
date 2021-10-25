import axios from 'axios'

export const state = () => ({
  message: 'Hello World!!',
  announce: '',
  importMsg: '',
  userData: {
    id: '',
    name: ''
  },
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
    //IS Team
    "hyashir",
    "koguri",
    "toogaki",
    "jprzycho",
    "nsuzuki",
    "snishik",
    "hmori",
    "" //←誰でもアクセス。本番環境では削除する
  ],
  isAdmin: false
})

export const mutations = {
  setUserData: function (state, data) {
    state.userData.id = data.id;
    state.userData.name = data.name;
  },
  setIsAdmin: function (state, isAdmin) {
    state.isAdmin = isAdmin;
  },
  setAnnounce: function (state, announce) {
    //リストの先頭にある最新のデータを取得
    state.announce = announce.list[0].data;
  },
  setImportMsg: function (state, data) {
    state.importMsg = data.list[0].data;
  },
  setAdmin: function (state) {
    state.isAdmin = true;
  }
}

export const actions = {
  getUserData: async function ({
    commit
  }) {
    await axios
      .get('http://lejnet/API/src/user/')
      .then(res => {
        commit('setUserData', res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },
  getAnnounceData: async function ({
    commit
  }) {
    await axios.get('http://lejnet/API/src/json/csnet/announce.json', {
        params: {
          date: new Date().getTime()
        }
      })
      .then(res => {
        commit('setAnnounce', res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },
  getImportMsgData: async function ({
    commit
  }) {
    await axios.get('http://lejnet/API/src/json/csnet/important-msg.json', {
        params: {
          date: new Date().getTime()
        }
      })
      .then(res => {
        commit('setImportMsg', res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },
}
