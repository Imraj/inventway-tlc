var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

require('./models/User');
require('./models/Car');
require('./models/Partner');
require('./config/passport');

var routes = require('./routes/index');
var users = require('./routes/users');
var passport = require('passport');
var MongoStore = require('connect-mongo')(express);


var app = express();

mongoose.connect("mongodb://mhadiab:mhadiab85@app-tlc-318.mongo.dbs.appsdeck.eu:30245/app-tlc-318");
//mongodb://<user>:<password>@app-tlc-318.mongo.dbs.appsdeck.eu:30245/app-tlc-318
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.session({store:new MongoStore({mongooseConnection : mongoose.connection}),secret:"abcdefgh1234qwerty"}));


app.use('/', routes);
app.use('/users', users);

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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
