var TesterStat = require('../../../models/CIS/testerStat');
var Cal = require('../../../models/CIS/calendar');
var Apps = require('../../../models/CIS/gkbase');
var log = require('../../../libs/log');
var User = require('../../../models/user');



module.exports = function (app) {

  app.get('/api/cis/testerStat', function (req, res) {
    TesterStat.find(function (err, data) {
      if (err) {
        throw err;
      } else {
        TesterStat.populate(data, {
          path: 'user'
        }, function (err, data) {
          if (err) {
            console.error(err);
          } else {
            log.info(new Date() + ' - GET /API/CIS/TESTERSTAT');
            res.send(data);
          }
        });
      }
    });
  });

  app.post('api/cis/testerStat', function (req, res) {
    TesterStat.create({
      name: req.body.name,
      user: req.body.user
    }, function (err, data) {
      if (err) {
        throw err;
      } else {
        data.save(function (err, data) {
          if (err) res.send(err);
          console.log(data);
        });
      }
    });
  });

  app.put('/api/cis/testerStat/:id', function (req, res) {
    //get tester by id
    TesterStat.findById(id, function (err, tester) {
      if (err) {
        throw err;
      } else {
        if (req.body.insertNewApp === true) { // if add new app to the user trigger insertNewApp to true
          if (req.body._id && req.body.name && req.body.sdpId) {
            tester.app = { //app obj
              _id: req.body._id, // get _id of mongo
              name: req.body.name, // get name of app
              sdpId: req.body.sdpId // get id from sdp system 
            };
          } else {
            throw err;
          }
          tester.year = Date().getFullYear(); //get Date
          tester.testCycle = 1; //init testCycle 1
          tester.respTime = 0; //init with respTime 0
          tester.testCycleStorage = []; // init testCycle array for insert obj = {date: Date(), reason: String}
        } else {

        }


      }
    });
  });
};