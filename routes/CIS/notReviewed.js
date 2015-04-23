var routesFunction = require('../../libs/routesFunction');

module.exports = function (app) {
  app.get('/cis/:year/notReviewed', routesFunction.checkPermissionCIS, function (req, res) {
    res.locals.path = req.path;
    res.locals.year = req.params.year;
    if (req.user) {
      res.render('notReviewed.ejs', {
        user: req.user, // get the user out of session and pass to template
      });
    } else {
      res.render('notReviewed.ejs', {
        user: {
          local: {
            username: {
              first: 'Login or ',
              last: 'signup'
            },
            group: 'Guest'
          }
        }
      });
    }
  });
};