var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var User = mongoose.model("User");
var Car = mongoose.model("Car");
var Partner = mongoose.model("Partner");
var Inbox = mongoose.model("Inbox");
var Advert = mongoose.model("Advert");
var Event = mongoose.model("Event");
var Message = mongoose.model("Message");

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

router.post("/submit_event",function(req,res,next){

  var event = new Event({
      name:req.body.event.name,
      venue:req.body.event.venue,
      description:req.body.event.description,
      ev_date:req.body.event.date,
      ev_time:req.body.event.time,
      createdBy:req.body.createdBy
  });

  event.save(function(err,event){
      if(err){
        res.json({"error":err});
      }
      res.status('200').json({"success":true});
  });

});

router.post("/events",function(req,res,next){

  Event.find({},function(err,events){
    if(err)
    {
      return next(err);
    }
    else
    {
      res.status('200').json({success:true,events:events})
    }

  });

});

router.post("/event",function(req,res,next){

    var ev = req.body.id;

    Event.findOne({_id:ev},function(err,eve){
      if(err){
        return next(err);
      }
      else{
        res.status('200').json({success:true,eve:eve});
      }
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

router.post("/ads",function(req,res,next){

  Advert.find({},function(err,ads){

    if(err)
    {
      return next(err);
    }
    else
    {
      res.status('200').json({success:true,ads:ads})
    }

  });

});

router.post("/ad",function(req,res,next){

  var ad = req.body.id;

  Advert.findOne({_id:ad},function(err,ad){
    if(err){
      return next(err);
    }
    else{
      res.status('200').json({success:true,ad:ad});
    }
  });

});

router.post("/submit_blog",function(req,res,next){

  var blog= new Blog({
      type:req.body.blog.type,
      car_model:req.body.blog.model,
      car_year:req.body.blog.year,
      description:req.body.blog.description,
      image:req.body.blog.image,
      createdBy:req.body.createdBy,
      published:req.body.published
  });

  blog.save(function(err,blog){
      if(err){
        res.json({"error":err});
      }
      res.status('200').json({"success":true});
  });

});

router.post("/blogs",function(req,res,next){

  Blog.find({},function(err,blogs){

    if(err)
    {
      return next(err);
    }
    else
    {
      res.status('200').json({success:true,blogs:blogs})
    }

  });

});

router.post("/blog",function(req,res,next){

  var blog = req.body.id;

  Blog.findOne({_id:blog},function(err,blog){
    if(err){
      return next(err);
    }
    else{
      res.status('200').json({success:true,blog:blog});
    }
  });

});

router.post('/send_message',function(req,res,next){

  var subject = new Message({
    subject : req.body.msg.subject,
    content : req.body.msg.content,
    createdBy : req.body.createdBy,
    messageTo : req.body.msgTo
  });

  subject.save(function(err,msg){

    if(err)return next(err);

    return res.status('200').json({success:true});

  });

});

router.post('/reply_message',function(req,res,next){

  var subject = new Message({
    content : req.body.msg.content,
    createdBy : req.body.createdBy,
    messageType : "reply",
    messageParent : req.body.msgParentId
  });

  subject.save(function(err,msg){

    if(err)return next(err);

    return res.status('200').json({success:true});

  });

});

router.post('/messages',function(req,res,next){

  Message.find({messageType:"main"},function(err,msgs){

    if(err)return next(err);

    return res.status('200').json({messages:msgs});

  }).sort('-createdAt');

});

router.post('/message',function(req,res,next){

  var msgId = req.body.msgId;

  Message.findOne({ $or : [{_id:msgId},{messageParent:msgId}]},
      function(err,msg){

          if(err)return next(err);

          return res.status('200').json({message:msg});

      }).sort("-createdAt");


});

/*router.post('/child_messages',function(req,res,next){

  var msgId = req.body.msgId;

  Message.findOne({messageParent:msgId},function(err,msg){

    if(err)return next(err);

    return res.status('200').json({message:msg});

  });

});*/


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
