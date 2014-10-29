module.exports = function (app) {
  app.get('/401', function (req, res, next) {
    if (!req.user) {
      var err = new Error('Unauthorized: Access is denied');
      err.status = 401;
      res.render('401.ejs', {
        message: err.message,
        error: err
      });
    } else {
      next();
    }
  });
};