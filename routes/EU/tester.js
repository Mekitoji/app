module.exports = function (app) {
  app.get('/eu/testCycle', function (req, res) {
    res.locals.path = req.path;
    res.render('testCycle.ejs', {
      user: req.user, // get the user out of session and pass to template
    });
  });
}