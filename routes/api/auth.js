module.exports = function (app, passport) {
//temp
  function response(res, result, data, err) {
    res.json({
      result: result,
      data: data,
      err: err,
    });
  }
  app.post('/api/auth', function (req, res, next) {
    passport.authenticate('local-login', function (err, user) {
      if (err) {
        response(res, false, null, "Server error.")
        next();
      }
      if (!user) {
        response(res, false, null, "User not find!")
      }
      req.logIn(user, function (err) {
        if (err) {
          res.json({
            "result": false
          });
          next();
        }
        res.json({
          "result": true,
          "data": {
            email: user.local.email,
            group: user.local.group,
            username: {
              first: user.local.username.first,
              last: user.local.username.last
            }
          },
          "error": null
        });
      });
    })(req, res, next);
  });
