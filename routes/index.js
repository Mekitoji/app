var routesFunction = require('../libs/routesFunction');

module.exports = function (app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', routesFunction.alreadyLoginIn, function (req, res) {
    res.render('index.ejs');
  });

  // CORE
  require('./core/login')(app, passport);
  require('./core/signup')(app, passport);
  require('./core/profile')(app);
  require('./core/logout')(app);
  require('./core/forgotPassword')(app, passport);
  require('./core/resetPassword')(app);
  require('./core/changePassword')(app);

  //CISEU pages
  require('./CISEU/main')(app);
  require('./CISEU/approved')(app);
  require('./CISEU/outdated')(app);
  require('./CISEU/inwork')(app);
  require('./CISEU/notReviewed')(app);
  require('./CISEU/postmail')(app);
  require('./CISEU/mailSuccess')(app);
  require('./CISEU/tester')(app);
  require('./CISEU/newTester')(app);
  require('./CISEU/testerViewPage')(app);
  require('./CISEU/testerList')(app);

  //CISEU history
  require('./CISEU/history/main')(app);
  require('./CISEU/history/testerList')(app);

  //CIS pages
  require('./CIS/main')(app);
  require('./CIS/approved')(app);
  require('./CIS/outdated')(app);
  require('./CIS/inwork')(app);
  require('./CIS/notReviewed')(app);
  require('./CIS/postmail')(app);
  require('./CIS/mailSuccess')(app);
  require('./CIS/tester')(app);
  require('./CIS/newTester')(app);
  require('./CIS/testerViewPage')(app);
  require('./CIS/testerList')(app);

  //CIS history
  require('./CIS/history/main')(app);
  require('./CIS/history/testerList')(app);

  //EU pages
  require('./EU/main')(app);
  require('./EU/approved')(app);
  require('./EU/outdated')(app);
  require('./EU/inwork')(app);
  require('./EU/notReviewed')(app);
  require('./EU/postmail')(app);
  require('./EU/mailSuccess')(app);
  require('./EU/tester')(app);
  require('./EU/newTester')(app);
  require('./EU/testerViewPage')(app);
  require('./EU/testerList')(app);

  //EU history
  require('./EU/history/main')(app);
  require('./EU/history/testerList')(app);

  //SIA pages
  require('./SIA/main')(app);
  require('./SIA/approved')(app);
  require('./SIA/outdated')(app);
  require('./SIA/inwork')(app);
  require('./SIA/notReviewed')(app);
  require('./SIA/postmail')(app);
  require('./SIA/mailSuccess')(app);
  require('./SIA/tester')(app);
  require('./SIA/newTester')(app);
  require('./SIA/testerViewPage')(app);
  require('./SIA/testerList')(app);

  //SIA history
  require('./SIA/history/main')(app);
  require('./SIA/history/testerList')(app);

  //Sandbox pages
  require('./Sandbox/main')(app);
  require('./Sandbox/approved')(app);
  require('./Sandbox/outdated')(app);
  require('./Sandbox/inwork')(app);
  require('./Sandbox/notReviewed')(app);
  require('./Sandbox/postmail')(app);
  require('./Sandbox/mailSuccess')(app);
  require('./Sandbox/tester')(app);
  require('./Sandbox/newTester')(app);
  require('./Sandbox/testerViewPage')(app);
  require('./Sandbox/testerList')(app);

  //Sandbox history
  require('./Sandbox/history/main')(app);
  require('./Sandbox/history/testerList')(app);

  //admin tools
  require('./tools/users')(app);
  require('./tools/testers')(app);
  require('./tools/rate')(app);
  require('./tools/sbcMember')(app);
  require('./tools/subscribeMember')(app);

  //api CORE
  require('./api/user')(app);
  require('./api/sdpParser')(app);
  require('./api/auth')(app, passport);
  require('./api/rate')(app);

  //api CIS
  require('./api/CIS/gk')(app);
  require('./api/CIS/calendar')(app);
  require('./api/CIS/tester')(app);
  require('./api/CIS/testerStats')(app);
  require('./api/CIS/history')(app); //new

  //api EU
  require('./api/EU/gk')(app);
  require('./api/EU/calendar')(app);
  require('./api/EU/tester')(app);
  require('./api/EU/testerStats')(app);
  require('./api/EU/history')(app); //new

  //api Sandbox
  require('./api/Sandbox/gk')(app);
  require('./api/Sandbox/calendar')(app);
  require('./api/Sandbox/tester')(app);
  require('./api/Sandbox/testerStats')(app);
  require('./api/Sandbox/history')(app); //new

  //api Sandbox
  require('./api/SIA/gk')(app);
  require('./api/SIA/calendar')(app);
  require('./api/SIA/tester')(app);
  require('./api/SIA/testerStats')(app);
  require('./api/SIA/history')(app); //new

  //new CISEU
  require('./api/CISEU/gk')(app);
  require('./api/CISEU/calendar')(app);
  require('./api/CISEU/tester')(app);
  require('./api/CISEU/testerStats')(app);
  require('./api/CISEU/history')(app); //new

  //errors
  require('./errors/401')(app);
  require('./errors/403')(app);
};
