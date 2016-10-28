var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var User = mongoose.model("User");
var Car = mongoose.model("Car");
var Partner = mongoose.model("Partner");

var passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/need_car',function(req,res,next){
  res.render('need_car',{title:"Need a car"})
});

router.post('/car',function(req,res,next){

    var shift = req.body.shift;
    var location = req.body.location;
    var zip_code = req.body.zip_code;
    var experience = req.body.experience;
    var createdBy = req.body.createdBy;

    var car = new Car({
      shift:shift,
      location:location,
      zip_code:zip_code,
      experience:experience,
      createdBy:createdBy
    });

    car.save(function(err,car){
        if(err)return next(err);

        return res.status('200').json({success:true});
    });

});

router.get('/need_partner',function(req,res,next){
  res.render('need_partner',{title:"Need a partner"})
});

router.post('/partner',function(req,res,next){

  var shift = req.body.shift;
  var location = req.body.location;
  var zip_code = req.body.zip_code;
  var experience = req.body.experience;
  var createdBy = req.body.createdBy;

  var partner = new Partner({
    shift:shift,
    location:location,
    zip_code:zip_code,
    experience:experience,
    createdBy:createdBy
  });

  partner.save(function(err,car){
      if(err)return next(err);
      return res.status('200').json({success:true});
  });

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
      req.session.first_name = user.first_name;
      req.session.last_name = user.last_name;
      req.session.user_id = user._id;
      req.session.email = user.email;
      req.session.valid = true;
      return res.status('200').json({success:true,session:req.session});
      //return res.redirect('/').json({});
    }
    else{
      return res.status(401).json(info);
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
      req.session.first_name = user.first_name;
      req.session.last_name = user.last_name;
      req.session.user_id = user._id;
      req.session.email = user.email;
      req.session.valid = true;
      return res.status('200').json({success:true,session:req.session});

  });

});

router.get('/profile',function(req,res,next){
    res.render('profile',{title:"My Profile"})
});


module.exports = router;
