import axios from 'axios';

export const state = () => ({
  announce: null,
  importMsg: null,
  LinkListCategory: null,
  LinkListItems: [],
  userData: {
    id: '',
    name: '',
  },
  admins: [
    'tyoshid',
    'sehara',
    'hkinjo',
    'mtanaka',
    'myabe',
    'kiwaoka',
    'aishii',
    'myamagu',
    'hokobaya',
    'mtakaha',
    //IS Team
    'hyashir',
    'koguri',
    'toogaki',
    'jprzycho',
    'nsuzuki',
    'snishik',
    'hmori',
    '', //←誰でもアクセス。本番環境では削除する
  ],
  isAdmin: false,
});

export const getters = {
  llc: function (state) {
    return state.LinkListCategory;
  },
};

export const mutations = {
  setUserData: function (state, data) {
    state.userData.id = data.id;
    state.userData.name = data.name;
    //管理者判定
    //state.isAdmin = state.admins.some(val => val == data.id);
  },
  setAnnounce: function (state, announce) {
    //リストの先頭にある最新のデータを取得
    state.announce = announce.list[0].data;
    //console.log(announce.list[0].data);
  },
  setImportMsg: function (state, data) {
    state.importMsg = data.list[0].data;
  },
  setAdmin: function (state) {
    state.isAdmin = true;
  },
  setLinkListCategory: function (state, data) {
    state.LinkListCategory = data;
  },
  setLinkListItems: function (state, data) {
    state.LinkListItems = data;
  },
};

export const actions = {
  getUserData: async function ({ commit }) {
    let res = await axios.get('http://lejnet/API/src/user/');
    commit('setUserData', res.data);
  },
  setAnnounceData: function ({ commit }, data) {
    commit('setAnnounce', data);
  },
  getAnnounceData: async function ({ commit }) {
    await axios
      .get('http://lejnet/API/src/json/csnet/announce.json', {
        params: {
          date: new Date().getTime(),
        },
      })
      .then((res) => {
        commit('setAnnounce', res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getImportMsgData: async function ({ commit }) {
    await axios
      .get('http://lejnet/API/src/json/csnet/important-msg.json', {
        params: {
          date: new Date().getTime(),
        },
      })
      .then((res) => {
        commit('setImportMsg', res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getLinkListCategory: function ({ commit }) {
    return axios
      .get('http://lejnet/API/accdb', {
        params: {
          db: 'CSNet/dataCenter/DB/Tool/tools_home.mdb',
          table: 'category',
        },
      })
      .then((res) => {
        commit('setLinkListCategory', res.data);
      });
  },
  getLinkListItems: function ({ commit }) {
    return axios
      .get('http://lejnet/API/accdb', {
        params: {
          db: 'CSNet/dataCenter/DB/Tool/tools_home.mdb',
          table: 'tool',
        },
      })
      .then((res) => {
        //console.log(res.data);
        commit('setLinkListItems', res.data);
      });
  },
};
