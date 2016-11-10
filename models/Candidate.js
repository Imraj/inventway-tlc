var mongoose = require('mongoose');

var CandidateSchema = mongoose.Schema({

  numberOfVotes : {type:Number,default:0},
  createdBy : String,
  username : String,
  info : String,
  createdAt:{type:Date,default:Date.now}

});

CandidateSchema.methods.increaseVote = function(){
  this.numberOfVotes ++;
}

CandidateSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }

  return next();

});

mongoose.model("Candidate",CandidateSchema);
