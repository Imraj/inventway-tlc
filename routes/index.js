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
var Blog = mongoose.model("Blog");
var HTVideo = mongoose.model("HTVideo");
var Group = mongoose.model("Group");
var Chat  = mongoose.model("Chat");
var Purchase = mongoose.model("Purchase");
var PayHistory = mongoose.model("PayHistory");

var session = require('express-session');
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
      car_model:req.body.ad.car_model,
      car_year:req.body.ad.car_year,
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

  var ad = req.body.adsId;
  console.log("ads Id : " + ad);

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
      title:req.body.blog.title,
      text:req.body.blog.text,
      image:req.body.blog.image,
      createdBy:req.body.createdBy,
      published:req.body.published
  });

  blog.save(function(err,blog){
      if(err){
        res.json({"error":err});
      }
      res.status('200').json({success:true});
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

  var blog = req.body.blogId;

  Blog.findOne({_id:blog},function(err,blog){
    if(err){
      return next(err);
    }
    else{
      console.log("blog is : " + blog);
      res.status('200').json({success:true,blog:blog});
    }
  });

});

router.post('/send_message',function(req,res,next){

  var message = new Message({
    subject : req.body.msg.subject,
    content : req.body.msg.content,
    createdBy : req.body.createdBy,
    messageTo : req.body.msgTo
  });
  console.log(JSON.stringify(message),null,4);
  message.save(function(err,msg){

    if(err)return next(err);

    return res.status('200').json({success:true});

  });

});

router.post('/reply_message',function(req,res,next){

  var message = new Message({
    content : req.body.msg.content,
    createdBy : req.body.createdBy,
    messageType : "reply",
    messageParent : req.body.msgParentId
  });

  message.save(function(err,msg){

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


router.post("/update_qualification",function(req,res,next){

  var driver_type = req.body.qua.vehicle;
  var driver_community = req.body.qua.qualif;
  var createdBy = req.body.createdBy;

  console.log(JSON.stringify(req.body),null,4);

  console.log(JSON.stringify(req.body.qua),null,4);

  var user = User.findById(createdBy);

  user.driver_type = driver_type;
  user.driver_community = driver_community;

  user.exec(function(err,us){

    if(err)return next(err);

    res.status('200').json({success:true});

  });

});

router.post("/pay_and_order_rank",function(req,res,next){

  var rank_type = req.body.rank.type;
  var rank_image = req.body.rank.image;
  var createdBy = req.body.createdBy;
  var payment_card_name = req.body.rank.card_name;
  var payment_card_number = req.body.rank.card_number;
  var payment_card_cvv = req.body.rank.card_cvv;
  var payment_exp_month = req.body.rank.card_exp_month;
  var payment_exp_year = req.body.rank.card_exp_year;

  var rank = new Rank({
    type:rank_type,
    imageURI : rank_image,
    createdBy : createdBy,
    card_name:payment_card_name,
    card_number:payment_card_number,
    card_cvv : payment_card_cvv,
    card_exp_year : payment_exp_year,
    card_exp_month : payment_exp_month
  });

  rank.save(function(err,rank){
      if(err)return next(err);

      return res.status('200').json({success:true});
  });


});


router.post("/save_and_exit_cod",function(req,res,next){

  var article = req.body.cod;
  var createdBy = req.body.createdBy;

  var cod = new COD({
    article : article,
    createdBy : createdBy
  });

  cod.save(function(err,cod){

    if(err)return next(err);

    if(cod){
      return res.status('200').json({message:true});
    }

  });


});

router.post("/activate_cod",function(req,res,next){

  var article = req.body.cod;
  var createdBy = req.body.createdBy;

  var cod = new COD({
    article : article,
    createdBy : createdBy,
    activated : true
  });

  cod.save(function(err,cod){

    if(err)return next(err);

    if(cod){
      return res.status('200').json({message:true});
    }

  });


});

router.post("/submit_ticket",function(req,res,next){

  var description = req.body.ticket.description;
  var ticket_image = req.body.ticket.ticket_image;
  var image = req.body.ticket.image;
  var video = req.body.ticket.video;
  var createdBy = req.body.createdBy;

  var ticket = new Ticket({
    description:description,
    ticket_image : ticket_image,
    image:image,
    video:video,
    createdBy : createdBy
  });

  ticket.save(function(err,ticket){

    if(err)return next(err);

    return res.status('200').json({success:true});

  });

});

router.post("/get_user_tickets",function(req,res,next){

  var userId = req.body.user;

  Ticket:find({createdBy:userId},function(err,ticket){

    if(err)return next(err);

    return res.status('200').json({success:true,tickets:ticket});

  });


});

router.post("/get_credit_card",function(req,res,next){

  var userId = req.body.user;

  Creditcard:find({createdBy:userId},function(err,card){

    if(err)return next(err);

    return res.status('200').json({success:true,card:card});

  });

});

router.post("/payment_history",function(req,res,next){

  var userId = req.body.createdBy;

  PayHistory:find({createdBy:userId},function(err,pay_history){

    if(err)return next(err);

    return res.status('200').json({success:true,payhistory:pay_history});

  });

});

router.post("/create_group",function(req,res,next){

  var groupName = req.body.data.name;
  var groupDescription = req.body.data.application;
  var userId = req.body.createdBy;

  var group = new Group({
    name:groupName,
    description:groupDescription,
    createdBy:userId
  });

  group.save(function(err,group){

    if(err)return next(err);

    return res.status('200').json({success:true});

  });

});


router.post("/get_groups",function(req,res,next){

  Group.find({},function(err,groups){

      if(err)return next(err);

      return res.status('200').json({success:true,groups:groups});

  });

});

router.post("/upload_htvideo",function(req,res,next){

  var htv = new HTVideo({

    videoURI:req.body.videoURI,
    createdBy:req.body.createdBy

  });

  htv.save(function(err,h){

    if(err)return next(err);

    return res.status('200').json({success:true});

  });

});

router.post("/get_garages",function(req,res,next){

  Garage:find({},function(err,garages){

    if(err)return next(err);

    return res.status('200').json({success:true,garages:garages});

  });

});

router.post("/send_chat_message",function(req,res,next){

   var user = req.body.createdAt;
   var groupId = req.body.data.group;
   var message = req.body.data.text;

   var chat = new Chat({
      group:groupId,
      message:message,
      createdBy : user
   });

   chat.save(function(err,c){
     if(err)return next(err);
     res.status('200').json({success:true});
   });

});

router.post("/get_group_messages",function(req,res,next){

    var group = req.body.group;

    Chat:find({group:group},function(err,messages){

        if(err)return next(err);

        return res.status('200').json({success:true,"messages":messages});

    });

});

var paypal = require('paypal-rest-sdk');
var paypal_config = {
    "host" : "api.sandbox.paypal.com",
    "port" : "",
    'client_id': 'ARLCssPTbHSfD--unv8QrrzApA_0bWp8WPbNxDAdV5OG5VyY8fLusOi2-Mt-7AhbWjrVFDOTXafjQuGS', //ARLCssPTbHSfD--unv8QrrzApA_0bWp8WPbNxDAdV5OG5VyY8fLusOi2-Mt-7AhbWjrVFDOTXafjQuGS
    'client_secret': 'EFrDiTimOBWnbBxh2CcHSaFyBtP8UDvV4E8zYsk6eRlI2AR5ChW3h9FEz0ot-XmvDGPq_KCjfa-XLA8M' //EFrDiTimOBWnbBxh2CcHSaFyBtP8UDvV4E8zYsk6eRlI2AR5ChW3h9FEz0ot-XmvDGPq_KCjfa-XLA8M
}
router.post("/process_credit_card",function(req,res,next){

   console.log(JSON.stringify(req.body.card,null,4));

   var product = req.body.package;
   var price = req.body.card.amount;
   var createdBy = req.body.createdBy;

    var card_data = {
      "number": req.body.card.number,
      "type": req.body.card.ctype,
      "expire_month": Number(req.body.card.exp_month),//12
      "expire_year": Number(req.body.card.exp_year),//2018
      "cvv2": Number(req.body.card.cvv),
      "first_name": req.body.card.firstname,
      "last_name": req.body.card.lastname
    };

    var amount_data = {
      "total":req.body.card.amount,
      "currency":"USD"
    }

    var payment_json = {
      "intent":"sale",
      "payer":{
        "payment_method":"credit_card",
        "funding_instruments":[{
          "credit_card":card_data
        }]
      },
      "transactions":[{
        "amount":amount_data,
        "description":"a test payment"
      }]
    }

    console.log("Sent payment is : " + JSON.stringify(payment_json,null,4));
    paypal.payment.create(payment_json,paypal_config,function(error,payment)
    {
          console.log("function payment is : " + payment);
          if(error)
          {
            console.log("I don't know what this is : " + error);
            return next(error);
          }
          else
          {
            console.log("payment response : " + JSON.stringify(payment,null,4));
            var purchase = new Purchase({
                createdBy : createdBy,
                product : product,
                transactionDetails : payment
            });

            var payhistory = new PayHistory({
                transactionType:product,
                createdBy : createdBy,
                transactionAmount : price
            });

            purchase.save(function(err,payment){
                if(err)return next(err);
                return res.status('200').json({success:true});
            });

            payhistory.save(function(err,payh){
                if(err)return next(err);
            });


          }
    });

});


router.post("/process_paypal",function(req,res,next){

   //console.log(JSON.stringify(req.body),null,4);

    var createdBy = req.body.createdBy;
    var type = req.body.package;
    var price = req.body.price;

    console.log("createdBy : " + createdBy + " | " + type + " | " + price);
    //if(type == "")
    //var amount = "";

    req.session.createdBy = createdBy;
    req.session.productType = type;
    req.session.price = price;

    var amount_data = {
      "total":price,
      "currency":"USD"
    }

    var payment = {
      "intent":"sale",
      "payer":
       {
        "payment_method":"paypal"
       },
       "redirect_urls":{
          "return_url":"http://app-tlc.scalingo.io/execute_card",
          "cancel_url":"http://app-tlc.scalingo.io/cancel_card"
       },
      "transactions":[{
        "amount":amount_data,
        "description":"a test payment"
      }]
    }

    //console.log("payment json b4 : " + JSON.stringify(payment,null,4));

    paypal.payment.create(payment,paypal_config,function(error,payment)
    {
          //console.log("payment json returned : " + JSON.stringify(payment,null,4));

          if(error){
            console.log("error : " + error);
            return next(error);
          }
          else{
                 console.log("payment.id : " + payment.id);
                 req.session.paymentId = payment.id;
                 var redirectUrl;

                 for(var i=0; i < payment.links.length; i++)
                 {
                   var link = payment.links[i];
                   if (link.method === 'REDIRECT')
                   {
                     redirectUrl = link.href;
                     console.log("redirectUrl : " + redirectUrl);
                   }
                 }
                 console.log("redirecting now to : " + redirectUrl);
                 return res.send(redirectUrl);

          }
    });

});

router.get("/execute_card",function(req,res,next){
    console.log(JSON.stringify(req.session),null,4);
    console.log(" execute_card : "  + req.session.productType + " | " + req.session.createdBy + " | " + req.session.price);

    var paymentId = req.session.paymentId;
    console.log("execute_card paymentId : " + paymentId);

    var payerId = req.param("PayerID");
    console.log("payerId : " + payerId);

    var details = {"payer_id":payerId};
    paypal.payment.execute(paymentId,details,paypal_config,function(error,payment){
      //console.log("exec payment : " + JSON.stringify(payment,null,4));
      if(error){
        //return res.send("error : " + error);
        return next(error);
      }
      else{

        console.log("completed execution paypal *aaa");
        var purchase = new Purchase({
           createdBy : req.session.createdBy,
           product : req.session.productType,
           transactionDetails : payment
       });

       var payhistory = new PayHistory({
           transactionType:req.session.productType,
           createdBy : req.session.createdBy,
           transactionAmount : req.session.price
       });

       purchase.save(function(err,payment){
           if(err)return next(err);
           //return res.status('200').json({success:true});
           return res.send("exec payment : " + JSON.stringify(payment,null,4));
       });

       payhistory.save(function(err,payh){
            if(err)return next(err);
       });

      res.status('200').json({success:true});

      }

    });

    //return res.send("in execute_card : " + paymentId + " | " + payerId);
});

router.get("/cancel_card",function(req,res,next){
    return res.send("The payment got cancelled");
});


module.exports = router;
