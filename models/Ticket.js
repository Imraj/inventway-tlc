var mongoose = require('mongoose');

var TicketSchema = mongoose.Schema({

  description:String,
  mediaURI:String,
  ticketURI:String,
  createdBy : String,
  createdAt:{type:Date,default:Date.now}

});

TicketSchema.pre("save",function(next){

  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }

  return next();

});

mongoose.model("Ticket",TicketSchema);
