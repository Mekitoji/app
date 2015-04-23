var routesFunction = require('../../libs/routesFunction');

module.exports = function (app) {
  app.get('/cis/:year/approved', routesFunction.checkPermissionCIS, function (req, res) {
    res.locals.path = req.path;
    res.locals.path = req.params.year;
    if (req.user) {
      res.render('approved.ejs', {
        user: req.user // get the user out of session and pass to template
      });
    } else {
      res.render('approved.ejs', {
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