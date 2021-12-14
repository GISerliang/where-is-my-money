import Vue from 'vue'
import App from './App'
import store from './store'

// 引入全局uView
import uView from '@/uni_modules/uview-ui'

Vue.config.productionTip = false;
Vue.prototype.$store = store

App.mpType = 'app'
Vue.use(uView)

const app = new Vue({
	store,
	...App
})
app.$mount()
