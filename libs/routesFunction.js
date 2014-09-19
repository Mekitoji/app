// route middleware to make sure a user is logged in
function redirectMain(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated()) {
    if (req.user.local.group === 'root' || req.user.local.group === 'gk') {
      res.locals.permission = 'root';
    } else {
      res.locals.permission = 'user';
    }
    console.log(res.permission);
    return next();
  }
  // if they aren't redirect them to the home page
  res.redirect('/');
}


// in libs or middleware&
function alreadyLoginIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/profile');
  } else {
    return next(); // load the index.ejs file
  }
}

exports.redirectMain = redirectMain;
exports.alreadyLoginIn = alreadyLoginIn;