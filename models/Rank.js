var mongoose = require('mongoose');

var RankSchema = mongoose.Schema({

  imageURI : String,
  type : String,
  card_name:String,
  card_number:String,
  card_cvv:String,
  card_exp_year:String,
  card_exp_month:String,
  createdBy : String,
  createdAt:{type:Date,default:Date.now}

});

RankSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }

  return next();

});

mongoose.model("Rank",RankSchema);
