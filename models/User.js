var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var UserSchema = mongoose.Schema({

  first_name:String,
  last_name:String,
  email:String,
  phone:String,
  hash:String,
  salt:String,
  createdAt:{type:Date,default:Date.now},
  accountType:{type:String,default:"user"},
  image:{type:String,default:"profile.png"}

});

UserSchema.pre("save",function(next){
  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }
  return next();

});

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64).toString('hex');
}

UserSchema.methods.validPassword= function(password)
{
  var hash = crypto.pbkdf2Sync(password,this.salt,1000,64).toString('hex');

  return this.hash === hash;
}

UserSchema.methods.generateJWT = function(){

  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate()+60);

  return jwt.sign({
    _id:this._id,
    first_name:this.first_name,
    last_name:this.last_name,
    email:this.email,
    exp:parseInt(exp.getTime()/1000)
  },'SECRET');

}

mongoose.model("User",UserSchema);
