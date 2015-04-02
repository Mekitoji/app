var historyCIS = require('../../../models/CIS/history');


module.exports = function (app) {
  app.get('/api/cis/history', function (req, res) {
    historyCIS.find()
      .exec(function (err, apps) {
        if (err) throw err;
        res.json(apps);
      });
  });

  app.get('/api/cis/history/:date', function (req, res) {
    var date = req.params.date;
    var fDate = new Date(date);
    var nextDay = new Date(date);
    nextDay.setDate(fDate.getDate() + 1);
    console.log(date);
    console.log(fDate);
    historyCIS.findOne({
      date: {
        '$gte': fDate,
        '$lt': nextDay
      }
    })

    .exec(function (err, data) {
      if (err) throw err;
      if (data === null) {
        res.send({
          "Error": "Date not found"
        });
      } else {
        res.json(data);
      }
    });
  })
}