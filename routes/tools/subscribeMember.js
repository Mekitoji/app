var sdpSubscribe = require('../../models/sdpSubscribe');
var member = require('../../models/sbcMember');
var async = require('async');
var routesFunction = require('../../libs/routesFunction');

module.exports = function(app) {
  app.get('/tools/subscribemember', routesFunction.checkPermission, function(req, res) {
    res.render('subscribe.ejs', {
      user: req.user
    });
  });

  app.get('/tools/subscribemember/all', function(req, res) {
    sdpSubscribe.all(function(err, data) {
      if(err) return res.send(err).status(500);
      sdpSubscribe.populate(data, {
        "path": "subscribers"
      }, function(err, d) {
        if(err) return res.send(err).status(500);
        return res.json(d).status(200);
      })
    });
  });


  app.put('/tools/subscribemember/subscribe/:id', function(req, res) {
    var id = req.params.id;
    var sub = req.body.subId;
    sdpSubscribe.findById(id)
    .exec(function(err, data) {
      if(err) return res.send(err).status(500);
      data.subscribe(sub);
      data.save(function(err, d) {
        if(err) return res.send(err).status(500);
        return res.status(200).end();
      });
    });
  });

  app.put('/tools/subscribemember/unsubscribe/:id', function(req, res) {
    var id = req.params.id;
    var sub = req.body.sub;
    sdpSubscribe.findById(id)
    .exec(function(err, data) {
      if(err) return res.send(err).status(500);
      res.status(200).end();
      data.unsubscribe(sub, function (err, data) {
          if (err) return res.send(err).status(500);

          return res.status(200).end();
      });
    });
  });

  app.put('/tools/subscribemember/watch/:id', function(req, res) {
    var id = req.params.id;

    sdpSubscribe.findById(req.params.id)
    .exec(function(err, data) {
      if(err) return res.send(err).status(500);
      console.log(req.body);
      async.eachSeries(req.body.subs, function iterator(v, cb) {
        // TODO
        // save subscribers to db
        data.subscribe(v._id);
        cb(null);
      }, function done(err) {
        data.addJiraIssue(req.body.jira);
        console.log(data);
        data.save(function(err, d) {
          if (err) return res.send(err).status(500);
          return res.status(200).end();
        });
      });
    })
  });

  app.put('/tools/subscribemember/unsubscribe/all/:id', function(req, res) {
    var id = req.params.id;

    sdpSubscribe.removeSubscriber(id, function() {
      res.status(200).end();
    });
  });

  app.put('/tools/subscribemember/:id', function(req, res) {
    var id = req.params.id;
    var issue = req.body.issue;
    var story = req.body.story;

    sdpSubscribe
      .findByIdAndUpdate(id, {$set: {issue: issue, story: story}})
      .exec(function(err) {
        if (err) return res.send(err).status(500);
        return res.status(200).end();
      });
  });
}
