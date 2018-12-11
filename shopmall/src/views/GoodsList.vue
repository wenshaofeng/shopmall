<template>
  <div>
    <!-- 头部 -->
    <nav-header></nav-header>
    <!-- 面包屑 -->
    <bread>
      <span>Goods</span>
    </bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortPrice()">
            Price
            <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':sortFlag}">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click='showFilterPop'>Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="setPriceFilter('all')">All
                </a>
              </dd>
              <dd v-for="(price,index) in priceFilter">
                <a href="javascript:void(0)" :class="{'cur':priceChecked==index}" @click="setPriceFilter(index)">{{price.startPrice}}
                  - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item of goodslist" :key="item.productId">
                  <div class="pic">
                    <a href="#">
                      <!-- <img :src="'static/'+item.prodcutImg" alt> -->
                      <img v-lazy="'static/'+item.productImage" alt>
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">
                        加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <!-- 滚动加载插件 -->
              <div class="view-more-normal" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"
                infinite-scroll-distance="30" infinite-scroll-throttle-delay='1000'>
                <!-- 加载中... -->

                <img v-show="loading" src="/static/loading-svg/loading-spinning-bubbles.svg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 模态框 -->
    <!-- 未登录 -->
    <Modal :mdShow='mdShow' @close='closeModal'>
      <p slot="message">
        请先登录，否则无法加入购物车！
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShow=false">关闭</a>
      </div>
    </Modal>
    <!-- 已登录 -->
    <Modal :mdShow='mdShowCart' @close='closeModal'>
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功!</span>
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看我的购物车</router-link>
      </div>
    </Modal>
    <!-- 响应式布局价格弹出遮罩 -->
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <!-- 底部 -->
    <nav-footer></nav-footer>
    <!-- Price图标  -->
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <symbol id="icon-arrow-short" viewBox="0 0 25 32">
          <title>arrow-short</title>
          <path class="path1" d="M24.487 18.922l-1.948-1.948-8.904 8.904v-25.878h-2.783v25.878l-8.904-8.904-1.948 1.948 12.243 12.243z"></path>
        </symbol>
        <symbol id="icon-status-ok" viewBox="0 0 32 32">
          <title>status-ok</title>
          <path class="path1" d="M22.361 10.903l-9.71 9.063-2.998-2.998c-0.208-0.209-0.546-0.209-0.754 0s-0.208 0.546 0 0.754l3.363 3.363c0.104 0.104 0.241 0.156 0.377 0.156 0.131 0 0.261-0.048 0.364-0.143l10.087-9.414c0.215-0.201 0.227-0.539 0.026-0.754s-0.539-0.226-0.754-0.026z"></path>
          <path class="path2" d="M16 30.933c-8.234 0-14.933-6.699-14.933-14.933s6.699-14.933 14.933-14.933c8.234 0 14.933 6.699 14.933 14.933s-6.699 14.933-14.933 14.933zM16 0c-8.822 0-16 7.178-16 16 0 8.823 7.178 16 16 16s16-7.177 16-16c0-8.822-7.178-16-16-16z"></path>
        </symbol>
      </defs>
    </svg>
  </div>
</template>

<script>
  import NavHeader from "@/components/Header";
  import NavFooter from "@/components/Footer";
  import Bread from "@/components/Breadcrumb";
  import axios from "axios";
  import Modal from '@/components/Modal'
  export default {
    name: "",
    components: {
      NavHeader,
      NavFooter,
      Bread,
      Modal
    },
    data() {
      return {
        goodslist: [], //商品列表
        priceFilter: [
          // 价格区间数组
          {
            startPrice: "0.00",
            endPrice: "100.00"
          },
          {
            startPrice: "100.00",
            endPrice: "500.00"
          },
          {
            startPrice: "500.00",
            endPrice: "1000.00"
          },
          {
            startPrice: "1000.00",
            endPrice: "5000.00"
          }
        ],
        priceChecked: "all", // 选中的价格区间
        filterBy: false, // 控制价格菜单面板的显示
        overLayFlag: false, // 遮罩的显示
        //分页和排序
        sortFlag: true,
        page: 1,
        pageSize: 8,

        busy: true, //滚动加载插件（默认禁用）
        loading: false, // 往下滚动"加载图标"的出现效果

        mdShow: false, // 未登录的模态框是否显示
        mdShowCart: false // 已登录的模态框是否显示
      };
    },
    methods: {

      getGoodsList(flag) {
        var param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1, // sortFlag为true升序
          priceLevel: this.priceChecked //点击的价格区间
        }
        this.loading = true
        setTimeout(() => {
          axios.get("/goods/list", {
            params: param // 传参
          }).then((res) => {
            this.loading = false
            var res = res.data;
            if (res.status == "0") {
              if (flag) { // true.商品数据累加
                this.goodslist = this.goodslist.concat(res.result.list);

                if (res.result.count == 0) { // 0条数据了，就不加载滚动加载方法了                      
                  this.busy = true; // 禁用
                } else {
                  this.busy = false; // 启用
                }

              } else { // 只加载一页
                this.goodslist = res.result.list;
                this.busy = false;
              }
            } else {
              this.goodslist = [];
            }
          })
        }, 1000)

      },

      showFilterPop() { // 点击filterBy出现价格菜单和遮罩
        this.filterBy = true;
        this.overLayFlag = true;
      },
      setPriceFilter(index) { // 点击价格
        this.priceChecked = index;
        this.page = 1 //注意价格过滤重新从第一页开始获取
        this.closePop();
        this.getGoodsList(); //发送请求
      },
      closePop() { // 关闭价格菜单和遮罩
        this.filterBy = false;
        this.overLayFlag = false;
      },
      sortPrice() { //根据价格排序
        this.sortFlag = !this.sortFlag
        this.page = 1 // 点击价格排序后从第一页开始
        this.getGoodsList()
      },
      loadMore() { // 滚动加载插件方法
        this.busy = true; // 滚动就禁用，防止下一个滚动
        setTimeout(() => { // 一个滚动完成之后再滚动加载下一个
          this.page++;
          this.getGoodsList(true); // 滚动加载是累加数据，并不是只显示一页数据，so需要传参去请求数据的地方判断一下
        }, 500);
      },
      addCart(productId) {
        axios.post('/goods/addCart', {
          productId: productId
        }).then((res) => {
          var res = res.data;
          if (res.status == 0) {
            // alert('加入成功')
            this.mdShowCart = true; // 加入购物车成功，成功的模态框显示
            this.$store.commit('updateCartCount',1)
          } else {
            // alert("msg:"+res.msg)
            this.mdShow = true // 未登录模态框显示
          }
        })
      },
      closeModal() { //关闭模态框
        this.mdShow = false; // 未登录模态框消失
        this.mdShowCart = false; // 未登录模态框消失

      }

    },
    mounted() {
      this.getGoodsList();
    }
  };

</script>
