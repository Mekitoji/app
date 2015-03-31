var historyCIS = require('../../../models/CIS/history');


module.exports = function (app) {
  app.get('/api/cis/history', function (req, res) {
    historyCIS.find()
      .exec(function (err, apps) {
        if (err) throw err;
        res.json(apps);
      });
  });
}