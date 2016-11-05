
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var User = mongoose.model("User");


passport.use(new LocalStrategy(
  {usernameField:'email',passwordField:'password'},function(email,password,done){
      User.findOne({email:email},function(err,user){
        if(err){
          console.log("my err here : " + err);
          return done(err);
        }

        if(!user){
            console.log("my err here 2 :  Incorrect email");
            return done(null,false,{message:"Incorrect email address"});
        }

        if(!user.validPassword(password)){
             console.log("my err here 3 :  Incorrect password");
            return done(null,false,{message : " Incorrect password "});
        }

        return done(null,user);

      });
  }
));
