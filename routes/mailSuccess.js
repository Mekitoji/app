module.exports = function (app) {
  app.get('/mailSuccess', function (req, res, next) {
    res.render('mailSuccess.ejs');
  });
};