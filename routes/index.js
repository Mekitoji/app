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
  var forgotPassword = require('./core/forgotPassword')(app, passport);
  var resetPassword = require('./core/resetPassword')(app);
  // var region = require('./core/region')(app);

  //CIS pages
  var mainCIS = require('./CIS/main')(app);
  var approvedCIS = require('./CIS/approved')(app);
  var outdatedCIS = require('./CIS/outdated')(app);
  var inworkCIS = require('./CIS/inwork')(app);
  var norReviewed = require('./CIS/notReviewed')(app);
  var postmailCIS = require('./CIS/postmail')(app);
  var mailSuccessCIS = require('./CIS/mailSuccess')(app);
  var testerCIS = require('./CIS/tester')(app);
  var newTesterCIS = require('./CIS/newTester')(app);
  var testerProfile = require('./CIS/testerViewPage')(app);
  var testerList = require('./CIS/testerList')(app);

  //EU pages
  var mainEU = require('./EU/main')(app);
  var approvedEU = require('./EU/approved')(app);
  var outdatedEU = require('./EU/outdated')(app);
  var inworkEU = require('./EU/inwork')(app);
  var norReviewedEU = require('./EU/notReviewed')(app);
  var postmailEU = require('./EU/postmail')(app);
  var mailSuccessEU = require('./EU/mailSuccess')(app);
  var testerEU = require('./EU/tester')(app);
  var newTesterEU = require('./EU/newTester')(app);
  var testerProfileEU = require('./EU/testerViewPage')(app);
  var testerListEU = require('./EU/testerList')(app);

  //SIA pages
  var mainEU = require('./SIA/main')(app);
  var approvedSIA = require('./SIA/approved')(app);
  var outdatedSIA = require('./SIA/outdated')(app);
  var inworkSIA = require('./SIA/inwork')(app);
  var norReviewedSIA = require('./SIA/notReviewed')(app);
  var postmailSIA = require('./SIA/postmail')(app);
  var mailSuccessSIA = require('./SIA/mailSuccess')(app);
  var testerSIA = require('./SIA/tester')(app);
  var newTesterSIA = require('./SIA/newTester')(app);
  var testerProfileSIA = require('./SIA/testerViewPage')(app);
  var testerListSIA = require('./SIA/testerList')(app);

  //Sandbox pages
  var mainSandbox = require('./Sandbox/main')(app);
  var approvedSandbox = require('./Sandbox/approved')(app);
  var outdatedSandbox = require('./Sandbox/outdated')(app);
  var inworkSandbox = require('./Sandbox/inwork')(app);
  var norReviewedSandbox = require('./Sandbox/notReviewed')(app);
  var postmailSandbox = require('./Sandbox/postmail')(app);
  var mailSuccessSandbox = require('./Sandbox/mailSuccess')(app);
  var testerSandbox = require('./Sandbox/tester')(app);
  var newTesterSandbox = require('./Sandbox/newTester')(app);
  var testerProfileSandbox = require('./Sandbox/testerViewPage')(app);
  var testerListSandbox = require('./Sandbox/testerList')(app);


  //admin tools
  var users = require('./tools/users')(app);
  var tester = require('./tools/testers')(app);


  //api CORE
  var api_user = require('./api/user')(app);
  var api_getJson = require('./api/getJson')(app);
  var api_auth = require('./api/auth')(app, passport);

  //api CIS
  var apiGkCIS = require('./api/CIS/gk')(app);
  var apiCalendarCIS = require('./api/CIS/calendar')(app);
  var apiTesterCIS = require('./api/CIS/tester')(app);
  var apiTesterStatCIS = require('./api/CIS/testerStats')(app); //new

  //api EU
  var apiGkEU = require('./api/EU/gk')(app);
  var apiCalendarEU = require('./api/EU/calendar')(app);
  var apiTesterEU = require('./api/EU/tester')(app);
  var apiTesterStatEU = require('./api/EU/testerStats')(app); //new

  //api Sandbox
  var apiGkSandbox = require('./api/Sandbox/gk')(app);
  var apiCalendarSandbox = require('./api/Sandbox/calendar')(app);
  var apiTesterSandbox = require('./api/Sandbox/tester')(app);
  var apiTesterStatSandbox = require('./api/Sandbox/testerStats')(app); //new

  //api Sandbox
  var apiGkSIA = require('./api/SIA/gk')(app);
  var apiCalendarSIA = require('./api/SIA/calendar')(app);
  var apiTesterSIA = require('./api/SIA/tester')(app);
  var apiTesterStatSIA = require('./api/SIA/testerStats')(app); //new

  //errors
  var unauthorized = require('./errors/401')(app);
  var permissionDenied = require('./errors/403')(app);

};