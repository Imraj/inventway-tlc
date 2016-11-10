var mongoose = require('mongoose');

var HTVideoSchema = mongoose.Schema({

  videoURI:String,
  createdBy : String,
  createdAt:{type:Date,default:Date.now}

});

HTVideoSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }

  return next();

});

mongoose.model("HTVideo",HTVideoSchema);
