module.exports = function (app) {
  app.get('/eu/:year/mailSuccess', function (req, res, next) {
    res.locals.year = req.params.year;
    res.locals.path = req.path;
    res.render('mailSuccess.ejs');
  });
};