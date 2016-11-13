var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var session = require('express-session');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

require('./models/User');
require('./models/Car');
require('./models/Partner');
require('./models/Inbox');
require('./models/Advert');
require('./models/Blog');
require('./models/Ticket');
require('./models/Election');
require('./config/passport');
require('./models/Event');
require('./models/Message');
require('./models/Blog');
require('./models/Group');
require('./models/Chat');
require('./models/HTVideo');
require('./models/Purchase');
require('./models/PayHistory');


var routes = require('./routes/index');
//var users = require('./routes/users');



var app = express();
//mongodb://<user>:<password>@app-tlc-4627.mongo.dbs.appsdeck.eu:30039/app-tlc-4627
mongoose.connect("mongodb://mhadiab:mhadiab85@app-tlc-4627.mongo.dbs.appsdeck.eu:30039/app-tlc-4627");
//mongoose.connect("mongodb://mhadiab:mhadiab85@localhost/app-tlc-4627");
//var Mongoose = require('mongoose');
//var db = Mongoose.createConnection('mongodb://USER:PASSWORD@localhost/DATABASE');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cors());
app.use(session({ resave: true ,secret: '12345_SECRET' , saveUninitialized: true}));

//app.use(session({store:new MongoStore({mongooseConnection : mongoose.connection}),secret:"abcdefgh1234qwerty"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


app.all('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/templates/index.html')); //load the angular index page.
});

app.use('/', routes);

//app.use('/users', users);


/*
app.get('*', function (req, res, next) {
    next();
});
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log("err.message =  : "+err.message);
    console.log("err =  : " + err);
    /*res.render('error', {
      message: err.message,
      error: err
    });*/
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  /*res.render('error', {
    message: err.message,
    error: {}
  });*/
  console.log("err.message =  : "+err.message);
  console.log("err =  : " + err);
});


module.exports = app;
