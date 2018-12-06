var express = require('express')
var router = express.Router() //express 框架自带的路由
var mongoose = require('mongoose')
var goods = require('../models/goods')

// 连接MongoDB数据库，数据库的名称叫dumall
mongoose.connect('mongodb://127.0.0.1:27017/dumall')

// 成功
mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
})

//失败
mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
})

//断开连接
mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
})

// 二级路由
// 查询商品列表数据

router.get('/', function (req, res, next) {

  //express获取请求参数  
  let page = parseInt(req.param("page")); //get请求数据拿到数据：res.param()
  let pageSize = parseInt(req.param("pageSize")) //limit需要传入number 
  let priceLevel = req.param("priceLevel"); // 传过来的价格区间
  let sort = req.param("sort");
  let skip = (page - 1) * pageSize
  let params = {}
  var priceGt = '',
    priceLte = '';
  if (priceLevel != 'all') { //价格区间过滤
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 5000;
        break;

    }
    params = {
      salePrice: {
        $gt: priceGt, // da大于
        $lte: priceLte //小于等于
      }
    }
  }

  let goodsModel = goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({
    'salePrice': sort
  }) //升序 1 降序 -1

  goodsModel.exec(function (err, doc) {
    if (err) {
      //res.json表示输出一个json文件
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})
module.exports = router;
