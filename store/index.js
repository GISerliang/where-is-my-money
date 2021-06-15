import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		uniDb: null
	},
	mutations: {
		setUniDb (state, db) {
			state.uniDb = db;
		}
	}
})
