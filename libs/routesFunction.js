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
  if (req.isAuthenticated()) {
    if (req.user.local.group === 'root' || req.user.local.group === 'gk' || req.user.local.group === 'gkEU') {
      return next();
    } else {
      // 403 error
      Forbidden();
    }
    return next();
  }
  // 401 error
  Unauthorized(res);
}

function checkPermissionRoot(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.local.group === 'root') {
      return next();
    } else {
      // 403 error
      Forbidden();
    }
    return next();
  }
  // 401 error
  Unauthorized(res);
}

function checkPermissionGkCIS(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.local.group === 'root' || req.user.local.group === 'gkCIS') {
      return next();
    } else {
      // 403 error
      Forbidden();
    }
    return next();
  }

  // 401 error
  Unauthorized(res);
}

function checkPermissionGkEU(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.local.group === 'root' || req.user.local.group === 'gkEU') {
      return next();
    } else {
      // 403 error
      Forbidden();
    }
    return next();
  }
  // 401 error
  Unauthorized(res);
}

function checkPermissionCIS(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.local.group === 'root' || req.user.local.group === 'gkCIS' || req.user.local.group === 'employerCIS') {
      return next();
    } else {
      // 403 error
      Forbidden();
    }
    return next();
  }
  // 401 error
  Unauthorized(res);
}

function checkPermissionEU(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.local.group === 'root' || req.user.local.group === 'employerEU' || req.user.local.group === 'gkEU') {
      return next();
    } else {
      // 403 error
      Forbidden();
    }
    return next();
  }
  // 401 error
  Unauthorized(res);
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