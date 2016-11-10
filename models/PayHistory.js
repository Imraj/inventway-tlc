var mongoose = require('mongoose');

var PayHistorySchema = mongoose.Schema({

  transactionType:String,
  transactionAmount:String,
  taxAmount:String,
  totalAmount:String,
  createdBy : String,
  createdAt:{type:Date,default:Date.now}

});

PayHistorySchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }

  return next();

});

mongoose.model("PayHistory",PayHistorySchema);
