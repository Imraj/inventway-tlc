
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var User = mongoose.model("User");


passport.use(new LocalStrategy(
  {usernameField:'email'},function(email,password,done){
      User.findOne({email:email},function(err,user){
        if(err){
          console.log("my err here : " + err);
          return done(err);
        }

        if(!user){
            return done(null,false,{message:"Incorrect email address"});
        }

        if(!user.validPassword(password)){
            return done(null,false,{message : " Incorrect password "});
        }

        return done(null,user);

      });
  }
));
