var sbcMember = require('../../models/sbcMember');

module.exports = function(app) {
  app.get('/tools/sbcmember', function(req, res) {
    res.render('members.ejs', {
      user: req.user
    });
  });

  app.post('/tools/sbcmember', function(req, res) {

  });
}
