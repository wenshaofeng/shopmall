var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express is very good' });
});

router.get('/test',function(req,res,next){
  res.send('respond with test');

})

module.exports = router;
