// route middleware to make sure a user is logged in

//handle 400 error
var Unauthorized = function Unauthorized(response) {
  var err = new Error('Unauthorized: Access is denied');
  err.status = 401;
  response.status(401).render('401.ejs', {
    message: err.message,
    error: err
  });
}

//handle 403 error
var Forbidden = function Forbidden(response) {
  err = new Error('Forbidden: You don\'t have permission to access this page');
  err.status = 403;
  response.render('403.ejs', {
    message: err.message,
    error: err
  });
}

var checkPermFor = function checkPermFor(req, res, next) {
  var args = arguments;
  var access = false;
  if (req.isAuthenticated()) {
    for (var i = 3; i < args.length; i++) {
      if (req.user.local.group === args[i]) {
        access = true;
      }
    }
    if (access) {
      return next();
    } else {
      // 403 error
      Forbidden(res);
    }
    return next();
  }
  // 401 error
  Unauthorized(res);
}

//check passport auth
function unAuth(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    // if (req.user.local.group === 'root' || req.user.local.group === 'gk') {
    //   res.locals.permission = 'root';
    // } else {
    //   res.locals.permission = 'user';
    // }
    // console.log(res.permission);
    // return next();
    return next();
  }
  // 401 error
  Unauthorized(res);
}

//check user group
function checkPermission(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gk', 'gkEU');
}

function checkPermissionRoot(req, res, next) {
  checkPermFor(req, res, next, 'root');
}

function checkPermissionGkCIS(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gk');
}

function checkPermissionGkEU(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gk', 'gkEU');
}

function checkPermissionCIS(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gk', 'employerCIS');
}

function checkPermissionEU(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gk', 'employerEU');
}



// in libs or middleware&
function alreadyLoginIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/profile');
  } else {
    return next(); // load the index.ejs file
  }
}

exports.unAuth = unAuth;
exports.alreadyLoginIn = alreadyLoginIn;
exports.checkPermission = checkPermission;
exports.checkPermissionCIS = checkPermissionCIS;
exports.checkPermissionEU = checkPermissionEU;
exports.checkPermissionGkCIS = checkPermissionGkCIS;
exports.checkPermissionGkEU = checkPermissionGkEU;
exports.checkPermissionRoot = checkPermissionRoot;