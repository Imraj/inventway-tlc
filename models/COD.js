var mongoose = require('mongoose');

var CODSchema = mongoose.Schema({

  article:String,
  createdBy : String,
  createdAt:{type:Date,default:Date.now},
  activated:{type:Boolean,default:false}
});

CODSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }

  return next();

});

mongoose.model("COD",CODSchema);
