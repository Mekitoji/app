var SDP = require('../../models/sdpSubscribe');

module.exports = function(app) {
  app.get('/api/subs/:id', function(req, res) {
    var id = req.params.id;
    SDP.findOne({ id: new RegExp(id, 'i') })
    .populate('subscribers')
    .exec(function(err, data) {
      if(err) return res.json({ error: err, data: null, message: 'Server error' });
      if (!data)
        return res.json({ data: null, message: 'Can\'t find application with given id', error: 'NOUSER' });
      else if (data.subscribers.length !== 0 )
        return res.json({ data: data.subscribers, message: 'Subsribers found.', error: null });
      else if (data.subscribers.length === 0 )
        return res.json({ data: [], message: 'No subscribers', error: null });
    });
  });
  app.get('/api/subs', function(req, res) {
    SDP.find({})
    .populate('subscribers')
    .exec(function(err, data) {
      if (err) return res.json({ error: err, data: null, message: 'Server error' });
      var result = [];
      for (var i = 0; i < data.length; i++ ) {
        result.push({ id: data[i].id, subscribers: data[i].subscribers });
      }
      return res.json({ error: null, data: result, message: 'All subsribers' });
    });
  });
};
