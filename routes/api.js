var User = require('../models/user');

module.exports = function(app) {

  // api ---------------------------------------------------------------------
  app.get('/api/users', function(req, res) {

    // use mongoose to get all users in the database
    User.find(function(err, users) {

      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err)

      res.json(users); // return all users in JSON format
    });
  });

  // create user and send back all users after creation
  app.post('/api/users', function(req, res) {

    // create a user, information comes from AJAX request from Angular
    User.create({
      text: req.body.text,
      done: false
    }, function(err, user) {
      if (err)
        res.send(err);

      // get and return all the users after you create another
      User.find(function(err, users) {
        if (err)
          res.send(err)
        res.json(users);
      });
    });

  });

  // delete a user
  app.delete('/api/users/:user_id', function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if (err)
        res.send(err);

      // get and return all the users after you create another
      User.find(function(err, users) {
        if (err)
          res.send(err)
        res.json(users);
      });
    });
  });

  // application -------------------------------------------------------------
  app.get('*', function(req, res) {
    res.render('index.ejs'); // load the single view file (angular will handle the page changes on the front-end)
  });
};