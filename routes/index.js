var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var User = mongoose.model("User");
var Car = mongoose.model("Car");
var Partner = mongoose.model("Partner");
var Inbox = mongoose.model("Inbox");

var passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.session.valid){
      res.render('index', { title: 'Home',session:req.session });
  }

  res.render('index', { title: 'Home'});
});

router.get('/need_car',function(req,res,next){

  if(req.session.valid)
  {
    res.render('need_car',{title:"Need a car",session:req.session});
  }
  else{
    req.session.renderTo = 'need_car';
    res.render("login",{session:req.session});
  }

});

router.post('/car',function(req,res,next){

    var shift = req.body.shift;
    var location = req.body.location;
    var zip_code = req.body.zip_code;
    var experience = req.body.experience;
    var createdBy = req.session.user_id;
    var model = req.body.car_model;
    var year =  req.body.car_year;

    var car = new Car({
      shift:shift,
      location:location,
      zip_code:zip_code,
      experience:experience,
      model:model,
      year:year,
      createdBy:createdBy
    });

    car.save(function(err,car){
        if(err)return next(err);
        res.redirect('/cars');
        //return res.status('200').json({success:true});
    });

});

router.get('/need_partner',function(req,res,next){
  if(req.session.valid){
      res.render('need_partner',{title:"Need a partner",session:req.session});
  }
  else{
    req.session.renderTo = 'need_partner';
    res.render('login',{session:req.session});
  }

});

router.post('/partner',function(req,res,next){

  var shift = req.body.shift;
  var location = req.body.location;
  var zip_code = req.body.zip_code;
  var experience = req.body.experience;
  var createdBy = req.session.user_id;
  var model = req.body.car_model;
  var year = req.body.car_year;

  var partner = new Partner({
    shift:shift,
    location:location,
    zip_code:zip_code,
    experience:experience,
    model:model,
    year:year,
    createdBy:createdBy
  });

  partner.save(function(err,car){
      if(err)return next(err);
      //return res.status('200').json({success:true});
      res.redirect('/partners');
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

      return res.render('index',{session:req.session});
    }
    else{
      return res.status(401).json(info);
    }

  })(req,res,next);

});

router.post("/logout",function(req,res,next){

  req.session.destroy();
  res.redirect('index');

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
      req.logIn(user,function(err){
        if(err){
          return next(err);
        }
        return res.render('index',{session:req.session});
      });
  });

});

router.get('/profile',function(req,res,next){
    if(req.session.valid)
    {
        res.render('profile',{title:"My Profile",session:req.session});
    }
    else{
       req.session.renderTo = 'profile';
       res.render('login',{title:'Login',session:req.session});
    }

});

router.get('/edit_profile',function(req,res,next){
    if(req.session.valid)
    {
        res.render('edit_profile',{title:"My Profile",session:req.session});
    }
    else{
       req.session.renderTo = 'profile';
       res.render('login',{title:'Login',session:req.session});
    }

});

router.post('/update_profile',function(req,res,next){

  var phone = req.body.phone;
  var email = req.body.email;
  var userId = req.session.user_id;

  var query = User.findById(user_id);

  query.exec(function(err,user){
    if(err)return next(err);
    if(user){
      user.email = email;
      user.phone = phone;
    }

    res.redirect("login");
  });

});

router.get('/inbox',function(req,res,next){


});

router.get("/cars",function(req,res,next){

  if(req.session.valid)
  {
    Car.find({},function(err,cars){
        if(err)return next(err);
        res.render('cars',{title:'All cars',cars : cars,session:req.session });
    });
  }
  else
  {
    res.redirect('login');
  }

});

router.get("/cars/:tmcar",function(req,res,next){

  var carId = req.body.tmcar;
  console.log("my carId is : " + carId);
  var query = Car.findById(carId);

  query.exec(function(err,car){
      if(err)return next(err);
      console.log("car is : " + car);
      res.render('car',{car:car,title:"Car",session:req.session});
  });

});

router.get("/inbox/:car/:user",function(req,res,next){

  var car = req.body.car;
  var user = req.body.user;

  if(req.session.valid){
      res.render('inbox',{car:car,createdBy:user,session:req.session});
  }
  res.redirect('/login');



});

router.get("/partners",function(req,res,next){

  if(req.session.valid)
  {
    Partner.find({},function(err,partners){
      if(err)return next(err);
      res.render('partners',{title:'All partners',partners : partners,session:req.session });
    });
  }
  else{
      res.redirect('login');
  }

});

router.get("/partner/:partner",function(req,res,next){

  var partnerId = req.param(partner);
  var query = Partner.findById(partnerId);

  query.exec(function(err,partner){
      if(err)return next(err);

      res.render('partner',{partner:partner,title:"Partner",session:req.session});
  });

});

router.get("/inbox/:partner/:user",function(req,res,next){

  var partner = req.param('partner');
  var user = req.param('user');

  if(req.session.valid){
      res.render('inbox',{partner:partner,createdBy:user,session:req.session});
  }
  res.redirect('/login');

});

router.get('/inbox',function(req,res,next){
  if(req.session.valid){
      res.render('inbox',{title:'Inbox',session:req.session});
  }
  else{
      res.redirect('login');
  }

});

router.get('inbox/:userid',function(req,res,next){

  var userId = req.body.userId;
  if(req.session.valid)
  {

  }

});

module.exports = router;
