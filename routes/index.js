var routesFunction = require('../libs/routesFunction');

module.exports = function (app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', routesFunction.alreadyLoginIn, function (req, res) {
    res.render('index.ejs');
  });
  //CIS
  //pages
  var login = require('./pages/login')(app, passport);
  var signup = require('./pages/signup')(app, passport);
  var profile = require('./pages/profile')(app);
  var logout = require('./pages/logout')(app);
  var main = require('./pages/main')(app);
  var approved = require('./pages/approved')(app);
  var outdated = require('./pages/outdated')(app);
  var inwork = require('./pages/inwork')(app);
  var postmail = require('./pages/postmail')(app);
  var mailSuccess = require('./pages/mailSuccess')(app);
  //errors
  var unauthorized = require('./errors/401')(app);
  var permissionDenied = require('./errors/403')(app);

  //api CIS
  var api_gk = require('./api/gk')(app);
  var api_calendar = require('./api/calendar')(app);
  var api_tester = require('./api/tester')(app);

  //api CORE
  var api_user = require('./api/user')(app);
  var api_getJson = require('./api/getJson')(app);
};