var url = require("url");
var queryString = require("querystring");

module.exports = function (app) {
  app.get('/getJson', function (req, res) {

    // parses the request url
    var theUrl = url.parse(req.url);

    // gets the query part of the URL and parses it creating an object
    var queryObj = queryString.parse(theUrl.query);

    // using JSON.parse will parse the jsonData to create an object
    var obj = JSON.parse(queryObj.jsonData);

    //print obj 
    res.json(obj);
    console.log(obj);
  });
};