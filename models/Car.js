var mongoose =require('mongoose');
var User = mongoose.model("User");

var CarSchema = mongoose.Schema({

  model:String,
  year:String,
  shift:String,
  location:String,
  zip_code:String,
  experience:String,
  createdAt:{type:Date,default:Date.now},
  createdBy:String

});

CarSchema.methods.getUserDetails = function(userId){

  User.find({_id:userId},function(err,user){
    if(err) throw(err);

    return user;
  });

};

CarSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }
  return next();

});

mongoose.model("Car",CarSchema);
