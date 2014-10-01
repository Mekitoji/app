module.exports = function (app) {
  app.get('/403', function (req, res, next) {
    var err;
    if (req.user) {
      if (req.user.local.group !== 'gk' || req.user.local.group !== 'root') {
        err = new Error('Forbidden: You don\'t have permission to access this page');
        err.status = 403;
        res.render('403.ejs', {
          message: err.message,
          error: err
        });
      } else {
        next();
      }
    } else {
      err = new Error('Unauthorized: Access is denied');
      err.status = 401;
      res.render('401.ejs', {
        message: err.message,
        error: err
      });
    }
  });
};