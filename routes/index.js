var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/need_car',function(req,res,next){
  res.render('need_car',{title:"Need a car"})
});

router.get('/need_partner',function(req,res,next){
  res.render('need_partner',{title:"Need a partner"})
});

router.get('/contact',function(req,res,next){
  res.render('contact',{title:"Contact us"})
});

router.get('/blog',function(req,res,next){
  res.render('blog',{title:"Blog"})
});

router.get('/login',function(req,res,next){
  res.render('login',{title:"Login"})
});

router.get('/register',function(req,res,next){
  res.render('register',{title:"Register"})
});

module.exports = router;
