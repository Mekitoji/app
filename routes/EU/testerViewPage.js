module.exports = function (app) {
  app.get('/eu/tester/:tester_id', function (req, res) {
    res.local.path = req.path;
    res.render('testerProfile.js', {
      user: req.user
    });
  })
}