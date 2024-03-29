var mongoose = require('mongoose');

var GroupSchema = mongoose.Schema({

  groupName:String,
  groupDescription:String,
  approved:{type:Boolean,default:false},
  createdBy : String,
  createdAt:{type:Date,default:Date.now}

});

GroupSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }

  return next();

});

mongoose.model("Group",GroupSchema);
