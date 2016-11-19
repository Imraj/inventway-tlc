var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var UserSchema = mongoose.Schema({

  email:{type:String,unique:true},
  actor:String,
  driver_type:String,
  driver_community:String,
  business_type:String,
  hash:String,
  salt:String,
  createdAt:{type:Date,default:Date.now},
  accountType:{type:String,default:"user"},
  image:{type:String,default:"/images/profile.jpg"}

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

UserSchema.methods.validPassword = function(password)
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
    accountType:this.accountType,
    actor:this.actor,
    driver_community:this.driver_community,
    driver_type : this.driver_type,
    business_type:this.business_type,
    image:this.image,
    email:this.email,
    exp:parseInt(exp.getTime()/1000)
  },'SECRET');

}

mongoose.model("User",UserSchema);
