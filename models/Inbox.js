var mongoose =require('mongoose');

var InboxSchema = mongoose.Schema({

  userA : String,
  userB : String,
  messages:[{from:"",to:"",createdAt:"",message:""}],


});

InboxSchema.pre("save",function(next){

  now = new Date();
  if(!this.messages.createdAt){
    this.messages.createdAt = now;
  }
  return next();

});

InboxSchema.methods.sendMessage = function(imessage)
{
  this.message.append(imessage);
}

mongoose.model("Inbox",InboxSchema);
