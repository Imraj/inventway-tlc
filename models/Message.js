var mongoose =require('mongoose');
var User = mongoose.model("User");

var MessageSchema = mongoose.Schema({

  subject:{type:String,default:"TLC Response to advert"},
  content:String,
  messageType:{type:String,default:"main"}, // 0 is main, 1 is reply
  messageParent:{type:String,default:"None"}, // None is parent for main message, original messageId is parent for reply messages
  createdBy:String,
  messageTo:String,
  createdAt:{type:Date,default:Date.now},
  seen:{type:Boolean,default:false}

});


MessageSchema.methods.getUserDetails = function(userId){

  User.find({_id:userId},function(err,user){
    if(err) throw(err);

    return user;
  });

};

MessageSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }
  return next();

});

mongoose.model("Message",MessageSchema);
