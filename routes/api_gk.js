var appGk = require('../models/gkbase.js');

module.exports = function(app) {

  // api ---------------------------------------------------------------------
  app.get('/api/gk', function(req, res) {

    // use mongoose to get all gk in the database
    appGk.find(function(err, gk) {

      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err)

      res.json(gk); // return all users in JSON format
    });
  });

  // create user and send back all users after creation
  app.post('/api/gk', function(req, res) {

    // create a user, information comes from AJAX request from Angular
    appGk.create({
      text: req.body.text,
      done: false
    }, function(err, gk) {
      if (err)
        res.send(err);

      // get and return all the users after you create another
      appGk.find(function(err, gks) {
        if (err)
          res.send(err)
        res.json(gks);
      });
    });

  });

  // delete a user
  app.delete('/api/gk/:gk_id', function(req, res) {
    appGk.remove({
      _id: req.params.gk_id
    }, function(err, gk) {
      if (err)
        res.send(err);

      // get and return all the users after you create another
      appGk.find(function(err, gks) {
        if (err)
          res.send(err)
        res.json(gks);
      });
    });
  });

  //update a user
  app.put('/api/gk/:gk_id', function(req, res) {

    // use our bear model to find the bear we want
    appGk.findById(req.params.gk_id, function(err, gk) {

      if (err) res.send(err);
      //put some data for update here
      // if (req.body.group) user.local.group = req.body.group;
      // if (req.body.email) user.local.email = req.body.email;
      // if (req.body.first) user.local.username.first = req.body.first;
      // if (req.body.last) user.local.username.last = req.body.last;

      // save the bear
      gk.save(function(err) {
        if (err)
          res.send(err);

        res.json(gk);
      });

    });
  });

  // application -------------------------------------------------------------
  //add emitter for development and production env
  app.get('*', function(req, res) {
    res.render('index.ejs'); // load the single view file (angular will handle the page changes on the front-end)
  });



};



/*.post(function(req, res) {
    
    var bear = new Bear();    // create a new instance of the Bear model
    bear.name = req.body.name;  // set the bears name (comes from the request)

    // save the bear and check for errors
    bear.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Bear created!' });
    });
    
  });
*/