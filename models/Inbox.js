var mongoose =require('mongoose');

var InboxSchema = mongoose.Schema({

  userA : String,
  userB : String,
  messages:[{from:"",to:"",createdAt:"",message:""}],

});

InboxSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }
  return next();

});

InboxSchema.methods.sendMessage(imessage){
  this.message.append(imessage);
}

mongoose.model("Inbox",InboxSchema);
