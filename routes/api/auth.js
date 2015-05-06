module.exports = function (app, passport) {

  app.post('/api/auth', function (req, res, next) {
    passport.authenticate('local-login', function (err, user) {
      if (err) {
        res.json({
          "result": false
        });
        next();
      }
      if (!user) {
        res.json({
          "result": false
        });
      }
      req.logIn(user, function (err) {
        if (err) {
          res.json({
            "result": false
          });
          next();
        }
        res.json({
          "result": true
        });
      });
    })(req, res, next);
  });

  // app.post('/api/auth',
  //   passport.authenticate('local-login'),
  //   function (req, res) {sttsuhydytsdduj
  //     // If this function gets called, authentication was successful.
  //     // `req.user` contains the authenticated user.
  //     console.log(req.user);
  //     res.json({
  //       "result": true
  //     });
  //   });
};