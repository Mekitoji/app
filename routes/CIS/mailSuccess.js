module.exports = function (app) {
  app.get('/cis/mailSuccess', function (req, res, next) {
    res.locals.path = req.path;
    res.render('mailSuccess.ejs');
  });
};