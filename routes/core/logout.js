// =====================================
// LOGOUT ==============================
// =====================================
module.exports = function (app) {
  app.get('/logout', function (req, res) {
    res.locals.path = req.path;
    req.logout();
    res.redirect('/');
  });
};