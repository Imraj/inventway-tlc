var mongoose =require('mongoose');
var User = mongoose.model("User");

var EventSchema = mongoose.Schema({

  name:String,
  description:String,
  venue:String,
  ev_date:String,
  ev_time:String,
  createdAt:{type:Date,default:Date.now},
  createdBy:String,

});


EventSchema.methods.getUserDetails = function(userId){

  User.find({_id:userId},function(err,user){
    if(err) throw(err);

    return user;
  });

};

EventSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }
  return next();

});

mongoose.model("Event",EventSchema);
