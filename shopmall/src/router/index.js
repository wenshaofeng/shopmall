import Vue from 'vue'
import Router from 'vue-router'

import GoodsList from '@/views/GoodsList' //商品列表页
import Cart from '@/views/Cart' //购物车页
import Address from '@/views/Address' //结算页

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    }
  ]
})
