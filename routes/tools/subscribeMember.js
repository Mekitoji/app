var sbcMember = require('../../models/sdp');

module.exports = function(app) {
  app.get('/tools/subscribemember', function(req, res) {
    res.render('subscribe.ejs', {
      user: req.user
    });
  });

  app.post('/tools/subscribemember', function(req, res) {

  });
}
