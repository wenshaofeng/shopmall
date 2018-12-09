<!-- 订单成功页 -->
<template>
  <div>
    <!-- 头部组件 -->
    <nav-header></nav-header>
    <!-- 面包屑组件 -->
    <nav-bread>
      <span>Order Success</span>
    </nav-bread>
    <!-- 中间内容 -->
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>Confirm</span> address</li>
          <li class="cur"><span>View your</span> order</li>
          <li class="cur"><span>Make</span> payment</li>
          <li class="cur"><span>Order</span> confirmation</li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
        <div class="order-create-main">
          <h3>Congratulations! <br>Your order is under processing!</h3>
          <p>
            <span>Order ID：{{orderId}}</span>
            <span>Order total：{{orderTotal|currency('$')}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <!-- <a href="javascript:;" class="btn btn--m">Cart List</a> -->
              <router-link class="btn btn--m" to="/cart">Cart List</router-link>
            </div>
            <div class="btn-r-wrap">
              <!-- <a href="javascript:;" class="btn btn--m">Goods List</a> -->
              <router-link class="btn btn--m" to="/">Goods List</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部组件 -->
    <nav-footer></nav-footer>
  </div>
</template>



<script type='text/ecmascript-6'>
  import NavHeader from '@/components/Header.vue' // 头部
  import NavFooter from '@/components/Footer.vue' // 底部
  import NavBread from '@/components/Breadcrumb.vue' // 面包屑
  import axios from 'axios'

  export default {
    data() {
      return {
        orderId: '',
        orderTotal: 0
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread
    },
    mounted() {
      var orderId = this.$route.query.orderId
      if (!orderId) {
        return
      }
      axios.get('/users/orderDetail', {
        params: {
          orderId: orderId
        }
      }).then((response) => {
        let res = response.data
        if (res.status == '0') {
          this.orderId = res.result.orderId
          this.orderTotal = res.result.orderTotal
        }

      })
    }

  }

</script>
