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
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">
                        加入购物车</a>
                    </div>
                  </div>
                </li>          
              </ul>
              <!-- 滚动加载插件 -->
              <div  class="view-more-normal"
                          v-infinite-scroll="loadMore"
                          infinite-scroll-disabled="busy"
                          infinite-scroll-distance="30"
                          infinite-scroll-throttle-delay='1000'
                          >
                      <!-- 加载中... -->
                    
                     <img v-show="loading" src="/static/loading-svg/loading-spinning-bubbles.svg" alt="">
              </div>
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
      overLayFlag: false, // 遮罩的显示
      //分页和排序
      sortFlag: true,
      page: 1, 
      pageSize: 8,

      busy: true, //滚动加载插件（默认禁用）
      loading: false  // 往下滚动"加载图标"的出现效果
    };
  },
  methods: {
    
    getGoodsList(flag){
            var param = {
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag ? 1 : -1 ,  // sortFlag为true升序
              priceLevel:this.priceChecked //点击的价格区间
            }
            this.loading = true
            setTimeout(()=>{
              axios.get("/goods/list",{
              params:param    // 传参
            }).then((res)=>{
                this.loading=false 
                var res = res.data;
                if(res.status == "0"){
                  if(flag){   // true.商品数据累加
                    this.goodslist = this.goodslist.concat(res.result.list);

                    if(res.result.count == 0){  // 0条数据了，就不加载滚动加载方法了
                      console.log('禁用了');
                     
                       
                      this.busy = true; // 禁用
                    }else{
                      this.busy = false; // 启用
                    }

                  }else{  // 只加载一页
                    this.goodslist = res.result.list;
                    this.busy = false;
                  }
                }else{
                  this.goodslist = [];
                }
            })
            },1000)
            
        },

    showFilterPop(){     // 点击filterBy出现价格菜单和遮罩
            this.filterBy = true;
            this.overLayFlag = true;
    },
    setPriceFilter(index){   // 点击价格
            this.priceChecked = index;
            this.page = 1 //注意价格过滤重新从第一页开始获取
            this.closePop();
            this.getGoodsList(); //发送请求
    },
    closePop(){    // 关闭价格菜单和遮罩
            this.filterBy = false;
            this.overLayFlag = false;
    },
    sortPrice(){  //根据价格排序
          this.sortFlag = !this.sortFlag
          this.page = 1   // 点击价格排序后从第一页开始
          this.getGoodsList()
    },
    loadMore(){   // 滚动加载插件方法
        this.busy = true; // 滚动就禁用，防止下一个滚动
        setTimeout(() => {   // 一个滚动完成之后再滚动加载下一个
            this.page++;
            this.getGoodsList(true);  // 滚动加载是累加数据，并不是只显示一页数据，so需要传参去请求数据的地方判断一下
        }, 500);
    },
    addCart(productId){
      axios.post('/goods/addCart',{
        productId:productId
      }).then((res)=>{
        var res = res.data ;
        if(res.status == 0){
          alert('加入成功')
        }else{
          alert('msg:'+res.msg)
        }
      })
    }

  },
  mounted() {
    this.getGoodsList();
  }
};
</script>

