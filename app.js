//app.js
//set up
var express       = require('express');
var path          = require('path');
var favicon       = require('static-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var url           = require('url');

//logs
var log           = require('./libs/log');

//require local config file
var config        = require('./config');

//passport
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//mongoose
var mongoose      = require('./libs/mongoose');
var flash         = require('connect-flash');

//session
var session       = require('express-session');
var MongoStore    = require('connect-mongo')(session);

//init express
var app           = express();


var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

//allow cross domain
app.use(allowCrossDomain);

// view engine setup
// set up ejs for templating
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set up express application
app.use(favicon());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//enable logger if env not production
if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
}

//pass passport fot configutation
require('./libs/passport')(passport);

var mgsOptions = {
  url: config.get('mongoose').uri,
};

app.use(session(Object.defineProperty(config.get("session"), "store", {value: new MongoStore(mgsOptions)})));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// ******Routes
var routes = require('./routes/index')(app, passport);

// catch 404 and forward to error handler if it developement env
// or send message about err to user if it production env
app.use(function (req, res, next) {
  if (app.get('env') === 'development') {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
    res.end('Page not found');
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.ejs', {
      message: err.message,
      error: err
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.ejs', {
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
