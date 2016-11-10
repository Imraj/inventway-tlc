var mongoose = require('mongoose');

var CreditcardSchema = mongoose.Schema({

  card_name:String,
  card_number:String,
  card_exp_year:String,
  card_exp_month:String,
  card_cvv:String,
  createdBy : String,
  createdAt:{type:Date,default:Date.now}

});

CreditcardSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }

  return next();

});

mongoose.model("Creditcard",CreditcardSchema);
