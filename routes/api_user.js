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

    //update a user
    app.put('/api/users/:user_id', function(req, res) {

        // use our bear model to find the bear we want
        User.findById(req.params.user_id, function(err, user) {

            if (err) res.send(err);
            if (req.body.group) user.local.group = req.body.group;
            if (req.body.email) user.local.email = req.body.email;
            if (req.body.first) user.local.username.first = req.body.first;
            if (req.body.last) user.local.username.last = req.body.last;

            // save the bear
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json(user);
            });

        });
    });

    // application -------------------------------------------------------------
    //add emitter for development and production env


};