var url = require("url");
var queryString = require("querystring");

module.exports = function (app) {
  app.post('/getJson', function (req, res) {

    //req.body.data
    console.log(req.body);
    if (true) {
      res.json({
        "result": true
      });
    }
  });
};