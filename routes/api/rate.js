var Rate = require('../../models/rate');


module.exports = function(app) {
  app.get('/api/rate', function(req, res) {
    Rate.find({}, function(err, data) {
      if(err) res.send(err);
      res.json(data);
    });
  });
  app.get('/api/rate/:region', function(req, res) {
    var region = req.params.region;
    Rate.getRegion(region, function(err, data) {
      if(err) return res.send(err);
      res.send(data);
    });
  });
};