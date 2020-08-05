import Vue from 'vue'
import store from './store'
import App from './App'

import '@/common/filter' // global filter

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
