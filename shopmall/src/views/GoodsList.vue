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
          <a href="javascript:void(0)" class="price">
            Price
            <svg class="icon icon-arrow-short">
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
                <a
                  href="javascript:void(0)"
                  :class="{'cur':priceChecked=='all'}"
                  @click="setPriceFilter('all')"
                >All
                </a>
              </dd>
              <dd v-for="(price,index) in priceFilter">
                <a
                  href="javascript:void(0)"
                  :class="{'cur':priceChecked==index}"
                  @click="setPriceFilter(index)"
                >{{price.startPrice}} - {{price.endPrice}}</a>
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
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 响应式布局价格弹出遮罩 -->
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <!-- 底部 -->
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from "@/components/Header";
import NavFooter from "@/components/Footer";
import Bread from "@/components/Breadcrumb";
import axios from "axios";
export default {
  name: "",
  components: {
    NavHeader,
    NavFooter,
    Bread
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
      overLayFlag: false // 遮罩的显示
    };
  },
  methods: {
    getGoodsList() {  //获取商品列表数据
      axios.get("/goods").then(res => {
        var data = res.data
        console.log(data);

        if (data.status == 0) {
          this.goodslist = data.result.list;
        }
      });
    },
    showFilterPop(){     // 点击filterBy出现价格菜单和遮罩
            this.filterBy = true;
            this.overLayFlag = true;
    },
    setPriceFilter(index){   // 点击价格
            this.priceChecked = index;
            this.closePop();
            this.getGoodsList();
    },
    closePop(){    // 关闭价格菜单和遮罩
            this.filterBy = false;
            this.overLayFlag = false;
    },
  },
  mounted() {
    this.getGoodsList();
  }
};
</script>
