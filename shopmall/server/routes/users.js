var express = require('express');
var router = express.Router();
var User = require('./../models/user')

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
      });
    }
  })
})

module.exports = router;
