var mongoose =require('mongoose');

var PartnerSchema = mongoose.Schema({

  shift:String,
  location:String,
  zip_code:String,
  experience:String,
  createdAt:{type:Date,default:Date.now},
  createdBy:String

});

PartnerSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }
  return next();

});

mongoose.model("Partner",PartnerSchema);
