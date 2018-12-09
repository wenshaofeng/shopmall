import Vue from 'vue'
import Router from 'vue-router'

import GoodsList from '@/views/GoodsList' //商品列表页
import Cart from '@/views/Cart' //购物车页
import Address from '@/views/Address' //结算页
import OrderConfirm from "@/views/OrderConfirm" //订单确认页
import OrderSuccess from "@/views/OrderSuccess" //订单完成页

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList', //商品首页
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'Cart',  //购物车列表
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',  //地址列表
      component: Address
    },
    {
      path: '/orderConfirm',
      name: 'OrderConfirm',  //订单确认页面
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',
      name: 'OrderSuccess',  //订单完成页
      component: OrderSuccess
    }
  ]
})
