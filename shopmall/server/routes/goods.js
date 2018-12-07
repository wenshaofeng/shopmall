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
router.get('/list', function (req, res, next) {

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
        msg: '成功',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

//加入购物车
router.post('/addCart', function (req, res, next) {
  var userId = '100000077',
    productId = req.body.productId //post 请求
  var User = require('../models/user.js') //引入user模型

  //查询第一条，拿到用户信息
  User.findOne({
    userId: userId //查询条件
  }, function (err, userdoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      console.log("userDoc:" + userdoc); //用户数据
      if (userdoc) {
        let goodsItem = ''
        userdoc.cartList.forEach((item) => { //遍历用户购物车，判断加入购物车的商品是否已存在
          if (item.productId == productId) {
            goodsItem = item
            item.productNum++
          }
        })
        if (goodsItem) { //若购物车商品已存在
          userdoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: '1',
                msg: err2.message
              })
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              })
            }
          })
        } else { //若购物车商品不存在，就添加进去
          // 从商品列表页Goods查询点击加入购物车的那件商品信息
          goods.findOne({
            productId: productId
          }, function (err1, doc1) {
            if (err1) {
              res.json({
                status: '1',
                msg: err1.message
              })
            } else {
              if (doc1) {
                doc1.productNum = 1
                doc1.checked = 1
                userdoc.cartList.push(doc1) //添加信息到用户购物车列表中
                userdoc.save(function (err2, doc2) { //保存数据到数据库
                  if (err2) {
                    res.json({
                      status: '1',
                      msg: err2.message
                    })
                  } else {
                    res.json({
                      status: "0",
                      msg: '',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

/*  一：通过请求传过来的用户ID，查询数据库中有无用户信息
     二：通过用户信息文档，遍历购物车cartList判断购物车中是否已存在该商品信息
     (1)存在，数量加一，不加入商品信息
     (2)不存在，加入商品信息
*/
module.exports = router;
