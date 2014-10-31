module.exports = function (app) {
  app.get('/cis/mailSuccess', function (req, res, next) {
    res.render('mailSuccess.ejs');
  });
};