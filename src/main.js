import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import Vuex from 'vuex'
// import './common/stylus/index.styl'

Vue.config.productionTip = false


Vue.use(VueResource)
Vue.use(Vuex)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  VueResource,
  Vuex,
  render: h => h(App)
})
