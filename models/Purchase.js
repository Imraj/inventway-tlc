var mongoose = require('mongoose');

var PurchaseSchema = mongoose.Schema({

    product : String,
    transactionDetails:[],
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
