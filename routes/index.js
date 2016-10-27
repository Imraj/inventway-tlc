var express = require('express');
var router = express.Router();
var User = mongoose.model("User");

var passport = require('passport');


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

router.post('/login',function(req,res,next){

  passport.authenticate('local',function(err,user,info){

    if(err)return next(err);

    if(user){
      return res.json({token:user.generateJWT()});
    }
    else{
      return res.statue('401').json(info);
    }

  })(req,res,next);

});

router.get('/register',function(req,res,next){
  res.render('register',{title:"Register"})
});

router.post('/register',function(req,res,next){

  var user = new User({
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email
  });
  user.setPassword(req.body.password);

  user.save(function(err,user){
      if(err)return next(err);

      return res.status('200').json({success:true});
  });

});

module.exports = router;
