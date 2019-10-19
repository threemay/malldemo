// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'vuex'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(infiniteScroll)
// or with options
Vue.use(VueLazyload, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading: '/static/loading-svg/loading-bars.svg',
  // attempt: 1
})

const store = new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo(state, nickName){
      state.nickName = nickName
    },
    updateCartCount(state, cartCount){
      state.cartCount = cartCount
    },
  }
})

/* eslint-disable no-new */
 new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
})


