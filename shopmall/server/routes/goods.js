var express = require('express')
var router = express.Router() //express 框架自带的路由
var mongoose = require('mongoose')
var goods = require('../models/goods')

// 连接MongoDB数据库，数据库的名称叫dumall
mongoose.connect('mongodb://127.0.0.1:27017/dumall')

// 成功
mongoose.connection.on("connected",function(){
	console.log("MongoDB connected success.")
})

//失败
mongoose.connection.on("error",function(){
	console.log("MongoDB connected fail.")
})

//断开连接
mongoose.connection.on("disconnected",function(){
	console.log("MongoDB connected disconnected.")
})

//二级路由
router.get('/',function(req,res,next){
    goods.find({},function(err,doc) {
        if(err){
            //res.json表示输出一个json文件
            res.json({
                status: '1',
                msg :err.message
            })
        }else{
            res.json({
                status : '0',
                msg: '',
                result :{
                    count : doc.length,
                    list : doc
                }
            })
        }
    })
})
 module.exports = router;