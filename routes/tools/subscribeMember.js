var sdpSubscribe = require('../../models/sdpSubscribe');

module.exports = function(app) {
  app.get('/tools/subscribemember', function(req, res) {
    res.render('subscribe.ejs', {
      user: req.user
    });
  });

  app.get('/tools/subscribemember/all', function(req, res) {
    sdpSubscribe.all(function(err, data) {
      if(err) return res.send(err).status(500);
      return res.json(data).status(200);
    });
  });

  app.post('/tools/subscribemember', function(req, res) {
  });

  app.put('/tools/subscribemember', function(req, res) {

  });
}
