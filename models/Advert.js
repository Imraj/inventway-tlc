var mongoose =require('mongoose');
var User = mongoose.model("User");

var AdvertSchema = mongoose.Schema({

  model:String,
  year:String,
  type:String,
  description:String,
  createdAt:{type:Date,default:Date.now},
  createdBy:String,
  image:String

});


AdvertSchema.methods.getUserDetails = function(userId){

  User.find({_id:userId},function(err,user){
    if(err) throw(err);

    return user;
  });

};

AdvertSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }
  return next();

});

mongoose.model("Advert",AdvertSchema);
