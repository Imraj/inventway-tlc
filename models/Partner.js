var mongoose =require('mongoose');

var PartnerSchema = mongoose.Schema({

  shift:String,
  location:String,
  zip_code:String,
  experience:String,
  createdAt:{type:Date,default:Date.now},
  createdBy:String

});

PartnerSchema.methods.getUserDetails = function(userId){

  User.find({_id:userId},function(err,user){
    if(err) throw(err);

    return user;
  });

};

PartnerSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }
  return next();

});

mongoose.model("Partner",PartnerSchema);
