var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goods = require('./routes/goods')

var app = express();

// view engine setup
app.engine('.html', ejs.__express) //设置html后缀模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//登录拦截
app.use(function (req, res, next) {//捕获登录状态，进入路由之前先进入function
  if (req.cookies.userId) { //如果用户已登录，不拦截
    next()
  } else { 
    // console.log(req.originalUrl); //  '/goods/list?page=2&pageSize=8&sort=1&priceLevel=all'
    // console.log(req.path); // '/goods/list'
    if (req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.originalUrl.indexOf('/goods/list') > -1) {
      next() //如果用户未登录，开放一些可用的功能（白名单）如登录、登出、查看商品列表
    } else {
      res.json({
        status: '10001',
        msg: '当前用户未登录',
        result: ''
      })
    }
  }
})

//一级路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goods);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
