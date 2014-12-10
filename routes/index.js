var routesFunction = require('../libs/routesFunction');

module.exports = function (app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', routesFunction.alreadyLoginIn, function (req, res) {
    res.render('index.ejs');
  });

  // CORE
  var login = require('./core/login')(app, passport);
  var signup = require('./core/signup')(app, passport);
  var profile = require('./core/profile')(app);
  var logout = require('./core/logout')(app);
  var users = require('./core/users')(app);

  // var region = require('./core/region')(app);

  //CIS pages
  var mainCIS = require('./CIS/main')(app);
  var approvedCIS = require('./CIS/approved')(app);
  var outdatedCIS = require('./CIS/outdated')(app);
  var inworkCIS = require('./CIS/inwork')(app);
  var postmailCIS = require('./CIS/postmail')(app);
  var mailSuccessCIS = require('./CIS/mailSuccess')(app);

  //EU pages
  var mainEU = require('./EU/main')(app);
  var approvedEU = require('./EU/approved')(app);
  var outdatedEU = require('./EU/outdated')(app);
  var inworkEU = require('./EU/inwork')(app);
  var postmailEU = require('./EU/postmail')(app);
  var mailSuccessEU = require('./EU/mailSuccess')(app);

  //api CORE
  var api_user = require('./api/user')(app);
  var api_getJson = require('./api/getJson')(app);

  //api CIS
  var apiGkCIS = require('./api/CIS/gk')(app);
  var apiCalendarCIS = require('./api/CIS/calendar')(app);
  var apiTesterCIS = require('./api/CIS/tester')(app);

  //api EU
  var apiGkEU = require('./api/EU/gk')(app);
  var apiCalendarEU = require('./api/EU/calendar')(app);
  var apiTesterEU = require('./api/EU/tester')(app);

  //errors
  var unauthorized = require('./errors/401')(app);
  var permissionDenied = require('./errors/403')(app);

};