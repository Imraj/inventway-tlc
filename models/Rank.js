var mongoose = require('mongoose');

var RankSchema = mongoose.Schema({

  imageURI : String,
  rank_txt : String,
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
