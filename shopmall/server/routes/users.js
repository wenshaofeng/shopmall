var express = require('express');
var router = express.Router();
var User = require('./../models/user')

require('./../util/util') //引入时间格式化函数工具

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


//二级路由
//登录接口
router.post('/login', function (req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd,
  }
  User.findOne(param, function (err, doc) { //条件查询
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, { //cookie要写到res中，否则前端拿不到
          path: '/', //把cookie存储到服务器根目录
          maxAge: 1000 * 60 * 60 //生命周期 1小时
        })
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        // req.session.user = doc 要安装express session插件
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      } else {
        res.json({
          status: '1',
          msg: '账号或密码错误',
          result: ''
        })
      }
    }
  })

})

//登出接口
router.post('/logout', function (req, res, next) {
  res.cookie('userId', "", {
    path: '/',
    maxAge: -1 //生命周期
  })
  res.cookie('userName', "", {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''

  })
})

//登录校验
router.get('/checkLogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

//查询当前用户的购物车数据
router.get('/cartList', function (req, res, next) {
  var userId = req.cookies.userId
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})

// 购物车删除商品
router.post('/cartDel', function (req, res, next) {
  var userId = req.cookies.userId,
    productId = req.body.productId
  User.update({
    userId: userId
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ""
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

//购物车编辑商品
router.post('/cartEdit', function (req, res, next) {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({ //查询条件
    'userId': userId,
    'cartList.productId': productId
  }, { //修改的数据
    //如以下，由于cartList为数组结构，
    //所以cartList.$.productNum更新到具体某个位置的值，
    //而$为占位符，代表某一行数据下的productNum数据更新
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked
  }, function (err, doc) { //回调
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

//全选和取消全选
router.post('/editCheckAll', function (req, res, next) {
  var userId = req.cookies.userId,
    flag = req.body.checkAll ? '1' : '0'; //标志是全选还是全不选的状态
  User.findOne({
    userId: userId
  }, function (err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user) {
        user.cartList.forEach(element => {
          element.checked = flag
        });
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1,
              message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        })
      }
    }
  })
})

//查询用户地址接口
router.get('/addressList', function (req, res, next) {
  var userId = req.cookies.userId
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      })
    }
  })
})

//设置默认地址接口
/* 通过传来的addressId，去数据库中查找,找到addressList
根据address遍历addressList设置isDefault
设置完以后保存文档 */
router.post('/setDefault', function (req, res, next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'addressId is null',
      result: ''
    })
  } else {
    User.findOne({
      userId: userId
    }, function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        var addressList = doc.addressList
        addressList.forEach((item) => {
          if (item.addressId === addressId) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        })
        doc.save(function (err1, doc1) { //设置完以后保存文档
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: ''
            })
          }
        })
      }
    })
  }
})

//删除地址信息
router.post('/addressDel', function (req, res, next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId
  User.update({
    userId: userId
  }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ""
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

//创建订单功能
router.post('/payMent', function (req, res, next) {
  // 前端需要传的参数：订单的地址id;订单最终的总金额
  var userId = req.cookies.userId,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var address = '',
        goodsList = [];
      //获取当前用户的地址信息
      doc.addressList.forEach((item) => {
        if (addressId === item.addressId) {
          address = item
        }
      })
      //获取当前用户的购物车已购买的商品
      doc.cartList.filter((item) => {
        if (item.checked == '1') {
          goodsList.push(item)
        }
      })

      //创建订单Id
      var platform = '622' //平台系统架构码
      var r1 = Math.floor(Math.random() * 10)
      var r2 = Math.floor(Math.random() * 10)

      var sysDate = new Date().Format('yyyyMMddhhmmss'); // 系统时间：年月日时分秒
      var orderId = platform + r1 + sysDate + r2; // 21位

      // 订单创建时间
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

      //生成订单
      var order = {
        orderId: orderId, // 订单id
        orderTotal: orderTotal, // 订单总金额(前端传过来的参数)
        addressInfo: address, // 地址信息
        goodsList: goodsList, // 购买的商品信息
        orderStatus: '1', // 订单状态，1成功
        createDate: createDate // 订单创建时间
      }

      //订单信息存储到数据库
      doc.orderList.push(order)

      doc.save(function (err1, doc) {
        if (err1) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          // 返回订单的id和订单的总金额给前端，下一个页面要用
          res.json({
            status: "0",
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          });
        }
      })
    }
  })
})

//根据订单Id查询订单信息
router.get('/orderDetail', function (req, res, next) {
  var userId = req.cookies.userId,
    orderId = req.param('orderId') //前端传过来的订单Id
  User.findOne({
    userId: userId
  }, function (err, userInfo) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var orderList = userInfo.orderList //orderList订单列表
      if (orderList.length > 0) { //说明有订单
        var orderTotal = 0
        //遍历订单列表，根据订单Id得到该订单总金额orderTotal
        orderList.forEach((item) => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal
          }
        })
        if (orderTotal > 0) {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        } else {
          res.json({
            status: '120002',
            msg: '无此订单',
            result: ''
          })
        }
      } else {
        res.json({
          status: '120001',
          msg: '当前用户未创建订单',
          result: ''
        });
      }
    }
  })
})

module.exports = router;
