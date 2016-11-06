var mongoose =require('mongoose');
var User = mongoose.model("User");

var BlogSchema = mongoose.Schema({

  title:String,
  text:String,
  createdAt:{type:Date,default:Date.now},
  createdBy:String,
  image:String

});


BlogSchema.methods.getUserDetails = function(userId){

  User.find({_id:userId},function(err,user){
    if(err) throw(err);

    return user;
  });

};

BlogSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }
  return next();

});

mongoose.model("Blog",BlogSchema);
