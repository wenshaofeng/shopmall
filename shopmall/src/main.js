// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

import {currency} from './util/currency'

Vue.config.productionTip = false

Vue.filter("currency" , currency) //定义全局过滤器  currency.js传过来的本就是函数

import 'assets/css/base.css'
import 'assets/css/checkout.css'
import 'assets/css/login.css'
import 'assets/css/product.css'

Vue.use(infiniteScroll)
Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bars.svg"
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
