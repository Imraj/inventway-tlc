var mongoose = require('mongoose');
var User = mongoose.model("User");

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
        done(null, user.id);
});

    // used to deserialize the user
passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
     });
});

passport.use(new LocalStrategy(
  {usernameField:'email'},function(email,password,done){
      User.findOne({email:email},function(err,user){
        if(err)return done(err);

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
