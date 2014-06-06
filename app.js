var express = require('express');

var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//logs
var log = require('./libs/log');

//require local config file
var config = require('./config');
//passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//init express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*SESSION*/

var mongoose = require('./libs/mongoose');

var session = require('express-session');

var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: config.get('session:secret'),
    cookie: config.get("session:cookie"),
    store: new MongoStore({
        mongoose_connection: mongoose.connection
    })
}));



//test var at session *VIEWS*
// app.use(function(req, res, next) {
//     var sess = req.session
//     if (sess.views) {
//         sess.views++
//         res.setHeader('Content-Type', 'text/html')
//         res.write('<p>views: ' + sess.views + '</p>')
//         res.end()
//     } else {
//         sess.views = 1
//         res.end('welcome to the session demo. refresh!')
//     }
// });

/*END OF SESSION*/




// ******Routes
var routes = require('./routes/index');
var users = require('./routes/users');

app.use('/', routes);
app.use('/users', users);

// ******END of routes





// catch 404 and forward to error handler if it developement env
// or send message about err to user if it production env
app.use(function(req, res, next) {
    if (app.get('env') === 'development') {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    } else {
        res.send('Page not found');
    }
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


// start listen port
app.listen(config.get('port'), function() {
    log.info('server welcome you');
});









module.exports = app;