var mongoose = require('mongoose');

var PurchaseSchema = mongoose.Schema({

    price : String,
    product : String,
    createdBy:String,
    createdAt:{type:Date,default:Date.now}

});

PurchaseSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }

  return next();

});

mongoose.model("Purchase",PurchaseSchema);
