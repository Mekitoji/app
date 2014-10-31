var routesFunction = require('../../libs/routesFunction');

module.exports = function (app) {
  app.get('eu/inwork', routesFunction.unAuth, function (req, res) {
    if (req.user) {
      res.render('inwork.ejs', {
        user: req.user, // get the user out of session and pass to template
      });
    } else {
      res.render('inwork.ejs', {
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