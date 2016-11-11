var mongoose = require('mongoose');

var ChatSchema = mongoose.Schema({

    group:String,
    message:String,
    createdBy:String,
    createdAt:{type:Date,default:Date.now}

});

ChatSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }

  return next();

});

mongoose.model("Chat",ChatSchema);
