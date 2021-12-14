import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uniDb: null,
    userInfo: null
  },
  mutations: {
    setUniDb(state, db) {
      state.uniDb = db
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
      uni.$emit('LOGIN_CHANGED')
    }
  }
})
