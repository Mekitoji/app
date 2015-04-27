var routesFunction = require('../../libs/routesFunction');


module.exports = function (app) {
  app.get('/eu/:year/outdated', routesFunction.checkPermissionEU, function (req, res) {
    res.locals.year = req.params.year;
    res.locals.path = req.path;
    if (req.user) {
      res.render('outdated.ejs', {
        user: req.user // get the user out of session and pass to template
      });
    } else {
      res.render('outdated.ejs', {
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