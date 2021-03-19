import axios from 'axios'

export const state = () => ({
  message:'Hello World!!',
  announce:'',
  userData:{id:'',name:''},
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
      ""//←本番環境では削除する
    ],
    isAdmin:false
})

export const mutations = {
  setUserData: function(state, data){
    state.userData.id = data.id;
    state.userData.name = data.name;
  },
  setIsAdmin: function(state, isAdmin){
    state.isAdmin = isAdmin;
  },
  setAnnounce: function(state, announce){
    state.announce = announce;
  }
}

export const actions = {
  getUserData: async function({commit}){
    await axios
    .get('http://lejnet/API/src/user/')
    .then(res=>{
      commit('setUserData',res.data)
    })
    .catch(err => {
      console.log(err)
    })
  }
}