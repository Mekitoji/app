var routesFunction = require('../libs/routesFunction');

module.exports = function (app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', routesFunction.alreadyLoginIn, function (req, res) {
    res.render('index.ejs');
  });
  //
  var login = require('./login')(app, passport);
  var signup = require('./signup')(app, passport);
  var profile = require('./profile')(app);
  var logout = require('./logout')(app);
  var main = require('./main')(app);
  var approved = require('./approved')(app);
  var outdated = require('./outdated')(app);
  var inwork = require('./inwork')(app);
  var api_user = require('./api_user')(app);
  var api_gk = require('./api_gk')(app);
  var api_calendar = require('./api_calendar')(app);
  var api_tester = require('./api_tester')(app);
  var getJson = require('./getJson')(app);
  var postmail = require('./postmail')(app);
  var unauthorized = require('./401')(app);
};