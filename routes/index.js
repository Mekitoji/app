var routesFunction = require('../libs/routesFunction');

module.exports = function(app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', routesFunction.alreadyLoginIn, function(req, res) {
    res.render('index.ejs');
  });
  //
  var login = require('./login')(app, passport);
  var signup = require('./signup')(app, passport);
  var profile = require('./profile')(app);
  var logout = require('./logout')(app);
  var main = require('./main')(app);
  var api = require('../routes/api')(app);

};