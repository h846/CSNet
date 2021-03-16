import axios from 'axios'

export const state = () => ({
  message:'Hello World!!',
  userData:{id:'',name:''}
})

export const mutations = {
  setUserData: function(state, data){
    state.userData.id = data.id;
    state.userData.name = data.name;
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