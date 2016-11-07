var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var User = mongoose.model("User");
var Car = mongoose.model("Car");
var Partner = mongoose.model("Partner");
var Inbox = mongoose.model("Inbox");
var Advert = mongoose.model("Advert");

var passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home'});
});

router.post('/login',function(req,res,next){

  passport.authenticate('local',function(err,user,info){

    if(err)return next(err);

     if(user){
       return res.json({token:user.generateJWT()});
     }
     else{
       return res.status(401).json(info);
     }

   })(req,res,next);

});

router.post('/register',function(req,res,next){

  console.log(JSON.stringify(req.body,null,4));
  var user = new User({
    email : req.body.user.email,
    actor : req.body.user.actor,
    business_type : req.body.user.business_type,
    driver_type : req.body.user.driver_type,
    driver_community : req.body.user.driver_community,
    image : req.body.user.image
  });
  user.setPassword(req.body.user.password);
  user.save(function(err,ruser){
      if(err)return next(err);

      console.log("user is " + ruser);
      return res.json({token:user.generateJWT()});
  });

});

router.post("/submit_ad",function(req,res,next){

  var advert = new Advert({
      type:req.body.ad.type,
      car_model:req.body.ad.model,
      car_year:req.body.ad.year,
      description:req.body.ad.description,
      image:req.body.ad.image,
      createdBy:req.body.createdBy,
      published:req.body.published
  });

  advert.save(function(err,ad){
      if(err){
        res.json({"error":err});
      }
      res.status('200').json({"success":true});
  });

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

router.post("/logout",function(req,res,next){

  req.session.destroy();
  res.redirect('index');

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


router.post('/complete_profile',function(req,res,next){

  var user = req.session.user_id;
  var phone = req.body.phone;
  var neighbourhood = req.body.neighbourhood;
  var account_type = req.body.account_type;
  var car_type = req.body.car_type;

  User.find({_id:user},function(err,user){
      if(err)return next(err);

      if(user){
        user.phone = phone;
        user.neighbourhood = neighbourhood;
        user.account_type = account_type;
        user.car_type = car_type;

        res.redirect("/");
      }
  });

});

router.get("/cars",function(req,res,next){


    Car.find({},function(err,cars){
        if(err)return next(err);
        res.render('cars',{title:'All cars',cars : cars,session:req.session });
    });

});

router.get("/cars/:car",function(req,res,next){

  var carId = req.param('car');
  console.log("my carId is : " + carId);
  var query = Car.findById(carId);

  query.exec(function(err,car){
      if(err)return next(err);
      console.log("car is : " + car);
      res.render('car',{car:car,title:"Car",session:req.session});
  });

});

router.get("/partners",function(req,res,next){

    Partner.find({},function(err,partners){
      if(err)return next(err);
      res.render('partners',{title:'All partners',partners : partners,session:req.session });
    });


});

router.get("/partner/:partner",function(req,res,next){

  var partnerId = req.param(partner);
  var query = Partner.findById(partnerId);

  query.exec(function(err,partner){
      if(err)return next(err);

      res.render('partner',{partner:partner,title:"Partner",session:req.session});
  });

});


router.get('/mail',function(req,res,next){
  if(req.session.valid){
      res.render('all_contacts',{title:'Inbox',session:req.session});
  }
  else{
      res.redirect('login');
  }

});

router.get("/inbox/:user",function(req,res,next){

  var user = req.param('user');
  var me_user = req.session.user_id;

  if(req.session.valid)
  {
      Inbox.findOne({$or:[{userA:user,userB:me_user},{userA:me_user,userB:user}]},function(err,inbox){

          if(err)return next(err);
          if(inbox){
              res.render('inbox',{messages:inbox.messages,createdBy:user,session:req.session,title:"Inbox"});
          }
          else{
              res.render('inbox',{createdBy:user,session:req.session,title:"Inbox"});
          }


      });
  }
  else{
    res.redirect('/login');
  }

});

router.post("/inbox/send/:user",function(req,res,next){

  var user = req.param('user');
  var me_user = req.session.user_id;
  var message = req.body.message;

  if(req.session.valid)
  {
      Inbox.findOne({$or:[{userA:user,userB:me_user},{userA:me_user,userB:user}]},function(err,inbox){

          if(err)return next(err);

          if(inbox){
            inbox.messages.push({mesage:message,from:me_user,to:user});
          }
          else if(!inbox){
              messages = [{from:me_user,to:user,message:message}];
              var inbox = new Inbox({
                userA:me_user,
                userB:user,
                messages:messages
              });
              inbox.save(function(err,inb){
                if(err)return next(err);
                return res.status('200').json({success:true});
              });
          }

      });
  }
  else{
    res.redirect('/login');
  }

});




module.exports = router;
