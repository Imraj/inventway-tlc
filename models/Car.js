var mongoose =require('mongoose');

var CarSchema = mongoose.Schema({

  shift:String,
  location:String,
  zip_code:String,
  experience:String,
  createdAt:{type:Date,default:Date.now},
  createdBy:String

});

CarSchema.pre("save",function(next){

  now = Date.now;
  if(!this.createdAt){
    this.createdAt = now;
  }
  return next();

});

mongoose.model("Car",CarSchema);
