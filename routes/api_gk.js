var Apps = require('../models/gkbase');

module.exports = function(app) {

    // api ---------------------------------------------------------------------
    app.get('/api/gk', function(req, res) {

        // use mongoose to get all gk in the database
        Apps.find(function(err, app) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(app); // return all users in JSON format
        });
    });

    // create user and send back all users after creation
    app.post('/api/gk', function(req, res) {

        // create a user, information comes from AJAX request from Angular
        Apps.create({
            country: req.body.country,
            appName: req.body.appName,
            category: req.body.category,
            sdpStatus: req.body.sdpStatus,
            updateTime: req.body.updateTime,
            seller: req.body.seller,
            tv: req.body.tv,
            currentStatus: req.body.currentStatus,
            testCycles: req.body.testCycles,
            replyTime: req.body.replyTime,
            resp: req.body.resp
        }, function(err, app) {
            if (err)
                res.send(err);

            // get and return all the users after you create another
            Apps.find(function(err, apps) {
                if (err)
                    res.send(err)
                res.json(apps);
            });
        });

    });

    // delete a user
    app.delete('/api/gk/:app_id', function(req, res) {
        Apps.remove({
            _id: req.params.app_id
        }, function(err, app) {
            if (err)
                res.send(err);

            // get and return all the users after you create another
            Apps.find(function(err, apps) {
                if (err)
                    res.send(err)
                res.json(apps);
            });
        });
    });

    //update a user
    app.put('/api/gk/:app_id', function(req, res) {

        // use our bear model to find the bear we want
        Apps.findById(req.params.app_id, function(err, app) {

            if (err) res.send(err);
            //put some data for update here
            if (req.body.country) app.country = req.body.country;
            if (req.body.appName) app.appName = req.body.appName;
            if (req.body.category) app.category = req.body.category;
            if (req.body.sdpStatus) app.sdpStatus = req.body.sdpStatus;
            if (req.body.updateTime) app.updateTime = req.body.updateTime;
            if (req.body.seller) app.seller = req.body.seller;
            if (req.body.tv) app.tv = req.body.tv;
            if (req.body.currentStatus) app.currentStatus = req.body.currentStatus;
            if (req.body.testCycles) app.testCycles = req.body.testCycles;
            if (req.body.replyTime) app.replyTime = req.body.replyTime;
            if (req.body.resp) app.resp = req.body.resp;
            if (req.body._id) app._id = req.body._id; //  $id wont work, so use this id

            // save the bear
            app.save(function(err) {
                if (err)
                    res.send(err);

                res.json(app);
            });

        });
    });

    // application -------------------------------------------------------------
    //add emitter for development and production env



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