// route middleware to make sure a user is logged in
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
  // if they aren't redirect them to the home page
  res.redirect('/401');
}

//check user group 
function checkPermission(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.local.group === 'root' || req.user.local.group === 'gk' || req.user.local.group === 'gkEU') {
      return next();
    } else {
      res.redirect('/403');
    }
    return next();
  }
  res.redirect('/401');
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