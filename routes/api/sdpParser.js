var _          = require("lodash");
var nodemailer = require('nodemailer');
var sdp        = require('../../models/sdpSubscribe');
var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var transport = nodemailer.createTransport();
var members   = require('../../models/sbcMember');

var Apps, ApprovedApps, Cal;

/**
 * Init object with instructions
 * @type {Object}
 */
// todo: move workspace to db
var config = {
  headerArr: ['empty', 'appId', 'region', 'gk', 'appName', 'seller', 'updateDate', 'appStatus', 'gkReview'],
  table_caption: "Gate Keeper Review List",
  workspace: {
    "CISEU": {
      region: ["CS", "EU"],
      gk: {
        "SayantsAndrey": "AS",
        "RASTATURINSTANISLAV": "SR",
        "KipovskiyEvgeniy": "EK",
        "BelousovAlexey": "AB",
        "SKAKUNGRIGORY": "GS",
        "TurchenkoRoman": "RT"
      },
      mail: {
        to: '',
        from: "CIS & EU STE<noreply@lge.com>",
        cc: [],
        replyTo: ''
      }
    },
    "CIS": {
      region: [],
      gk: {
        "POLITAEVDMITRY": "DP",
        "SayantsAndrey": "AS",
        "EgorovVladimir": "VE",
        "KirillovYury": "YK"
      },
      mail: {
        to: '',
        from: "CIS STE<noreply@lge.com>",
        cc: [],
        replyTo: ''
      }
    },
    "EU": {
      region: [],
      gk: {
        "RASTATURINSTANISLAV": "SR",
        "TRESCHALOVNIKITA": "NT",
        "KipovskiyEvgeniy": "EK",
        "BelousovAlexey": "AB",
        "FilimonovMaxim": "MF",
        "SKAKUNGRIGORY": "GS"
      },
      mail: {
        to: '',
        from: "EU STE<noreply@lge.com>",
        cc: [],
        replyTo: ''
      }
    },
    "ALL": {
      region: ["all"],
      gk: {},
      mail: {
        to: '',
        from: "",
        cc: [],
        replyTo: ''
      }
    },
    "SIA": {
      region: ["AA", "HK", "MA", "NA", "TW"],
      gk: {},
      mail: {
        to: '',
        from: "",
        cc: [],
        replyTo: ''
      }
    }
  },
  currentWorkspace: null
};


var utils = {};
/**
 * check if value is null or undefined
 * @param  {[type]}  val value to check
 * @return {Boolean}
 */
utils.isNullOrUndefined = function (val) {
  if (val === null || val === undefined) {
    return true;
  } else {
    return false;
  }
};

utils.parseId = function(id) {
  id = id.split('[')[1];
  id = id.split(']')[0];
  return id;
};

/**
 * Show what region data we currently parse, and write it to config
 * @param  {string} Region to parse
 * @return {string|null} Workspace
 */
utils.checkData = function (region, caption, response) {
  //get config clean
  config.currentWorkspace = null;

  _.forEach(config.workspace, function (n, key) {
    _.forEach(n.region, function (r) {
      if (r === region) {
        config.currentWorkspace = key;
        return true;
      }
    });
  });

  if (!utils.isNullOrUndefined(config.currentWorkspace)) {
    return config.currentWorkspace;
  } else {
    this.responseToClient(response, false, "Can't find this region.");
    return null;
  }
};

/**
 * Response with json to client
 * @param  {Object} res    Response object
 * @param  {Boolen} result Result of parse
 * @param  {String} msg    Message to client
 * @param  {String} e      Error message
 * @return void
 */
utils.responseToClient = function (res, result, msg, e) {
  var err;
  if (process.env.NODE_ENV !== "development") err = null;
  else err = e ? e : null;
  res.json({
    "result": result,
    "msg": msg,
    "err": err
  });
};
/**
 * desv
 * @param  {String} workspace Current workspace
 * @return void
 */
utils.interface = function (workspace) {
  if (workspace === "CIS") {
    Apps = require('../../models/CIS/gkbase');
    ApprovedApps = require('../../models/CIS/gkbaseApproved');
    Cal = require('../../models/CIS/calendar');
  } else if (workspace === "EU") {
    Apps = require('../../models/EU/gkbase');
    ApprovedApps = require('../../models/EU/gkbaseApproved');
    Cal = require('../../models/EU/calendar');
  } else if (workspace === "ALL") {
    Apps = require('../../models/Sandbox/gkbase');
    ApprovedApps = require('../../models/Sandbox/gkbaseApproved');
    Cal = require('../../models/Sandbox/calendar');
  } else if (workspace === "SIA") {
    Apps = require('../../models/SIA/gkbase');
    ApprovedApps = require('../../models/SIA/gkbaseApproved');
    Cal = require('../../models/SIA/calendar');
  } else if (workspace === 'CISEU') {
    Apps = require('../../models/CISEU/gkbase');
    ApprovedApps = require('../../models/CISEU/gkbaseApproved');
    Cal = require('../../models/CISEU/calendar');
  } else {
    Apps = null;
    ApprovedApps = null;
    Cal = null;
  }
};

/**
 * Get current year
 * @return {Number} Year
 */
utils.getCurrentYear = function () {
  var date = new Date();
  return date.getFullYear();
};

module.exports = function (app) {
  app.post('/api/getJson', function (req, res) {
    var region = req.body.region;
    var caption = req.body.table_caption;
    var rawData = req.body.data;
    var workspace = utils.checkData(region, caption, res);
    var data = JSON.parse(rawData);
    var p = [];
    var requested = [];
    var firstTimeRequested = [];
    var approved = [];

    utils.interface(workspace);

    if (utils.isNullOrUndefined(Apps) || utils.isNullOrUndefined(ApprovedApps) || utils.isNullOrUndefined(Cal) || utils.isNullOrUndefined(workspace)) {
      utils.responseToClient(res, false, "Server error; Workspace is null;", null);
    }

    _.forEach(data, function (arr) {
      p.push(_.zipObject(config.headerArr, arr));
    });

    _.forEach(p, function (n) {
      Apps.findOne({
        applicationId: n.appId,
        year: utils.getCurrentYear()
      })
        .exec(function (err, app) {
          if (err) utils.responseToClient(res, false, "Server error", err);

          // use async lib gajdfajgasdgj!
          sdp.findOne({
            id: n.appId
          }, function (err, data) {
            if (err) utils.responseToClient(res, false, "Sdp db request error.", err);
            if (!data) {
              sdp.create({
                id: n.appId,
                status: n.appStatus,
                name: n.appName
              }, function (err) {
                if (err) utils.responseToClient(res, false, "Failed to create new sdp app", err);
                return;
              });

                if (n.appStatus === 'Gate Keeper Review Request') {
                  firstTimeRequested.push({
                    name: n.appName,
                    id: n.appId,
                    status: n.appStatus
                  });
                }

                if (n.appStatus === "Re-GK Review Request") {
                requested.push({
                  name: n.appName,
                  id: n.appId,
                  status: n.appStatus
                });
              }
            } else {
              if ((data.status !== "Gate Keeper Review Request" && data.status !== "Re-GK Review Request") &&
                (n.appStatus === "Gate Keeper Review Request" || n.appStatus === "Re-GK Review Request")) {
                requested.push({
                  name: n.appName,
                  id: n.appId,
                  status: n.appStatus
                });
              } else if(data.status !== 'App QA approved' && n.appStatus === 'App QA approved') {
                approved.push({
                  name: n.appName,
                  id: n.appId,
                  status: n.appStatus,
                });
              }
              data.status = n.appStatus;
              data.name = n.appName;
              data.save(function (err) {
                if (err) utils.responseToClient(res, false, "Failed to update sdp app", err);
              });
            }
          });


          var c = config.workspace[config.currentWorkspace];
          var resp = c.gk[n.gk] ? c.gk[n.gk] : "";
          if (app === null && n.appStatus !== "App QA approved" || app !== null && app.year !== utils.getCurrentYear()) {
            var prs = n.seller.split('(');
            var country = prs[1].slice(0, -1);
            var seller = prs[0];
            Apps.create({
              appName: n.appName,
              seller: seller,
              country: country,
              sdpStatus: n.appStatus,
              tv: "In Progress",
              testCycles: 1,
              updateTime: n.updateDate,
              replyTime: 0,
              resp: resp,
              applicationId: n.appId,
              year: utils.getCurrentYear()
            }, function (err, result) {
              if (err) utils.responseToClient(res, false, "Create app failed. ", err);
              Cal.create({
                appId: result._id
              }, function (err) {
                if (err) utils.responseToClient(res, false, "Create calendar failed", err);
                utils.responseToClient(res, true, "Data is succesfully parsed");
              });
            });
          } else if (app !== null) {

            Apps.findOne({
              applicationId: n.appId
            })
              .exec(function (err, app) {
                if (err) utils.responseToClient(res, false, "Server error", err);
                n.updateDate = new Date(n.updateDate);
                app.appName = n.appName;
                app.sdpStatus = n.appStatus;
                app.updateTime = n.updateDate;
                app.resp = resp;
                app.save(function (err) {
                  if (err) utils.responseToClient(res, false, "Failed to save data", err);
                  utils.responseToClient(res, true, "Apps succesfully updated");
                });
              });
          } else {
            utils.responseToClient(res, true, "QA approved app detected; skip it", null);
          }


        });
    });

    setTimeout(function () {
      var wspace = config.workspace[config.currentWorkspace];
      var currentRegion = region;
      var temp = new Date();
      var temp_date = temp.getDate();
      var temp_month = temp.getMonth();
      var temp_year = temp.getFullYear();

      firstTimeRequested.forEach(function(app) {

        var body = "<style>div{font:10pt Arial;}</style>";

        var rawId = app.id;

        app.id = utils.parseId(app.id);

        var reg = "groups.";
        if (currentRegion === 'CS') {
          reg += "cis";
        } else if (currentRegion === 'EU'){
          reg += "eu";
        }
        var query = {};
        query[reg] = true;

        console.log(query);
        members.find(query)
        .exec(function(err, m) {
          if (err) return res.status(500).end(err);
          //TODO: complete code here

          var subject = "[" + app.name + "] (" + app.id + ") <" + app.status + "> "  + temp_date + " " + monthArray[temp_month] + " " + temp_year;
          // **email body
          body += "<div><b> New apps arrive:</b><br /><br />";

          body += "<b>" + app.name + "[" + app.id + "]</b> with status - <b>" + app.status + "</b><br /><br />";

          body += "<br /><div>If you need assistance, have questions or want unsubscribe please contact <b>Grigory Skakun</b> (grigory.skakun@lge.com)</div>";
          // **end of email body

          var ccList = wspace.mail.cc.slice();


          var subArray = [];

          if(m.length > 0) {
            for(var i=0; i < m.length; i++) {
              subArray.push(m[i].mail);
            }
          }

          ccList = ccList.concat(subArray);

          console.log(m);
          console.log(ccList);

          var mailOptions = {
            from: wspace.mail.from,
            to: wspace.mail.to,
            cc: ccList,
            subject: subject,
            replyTo: wspace.mail.replyTo,
            text: body,
            html: body,
          };
          transport.sendMail(mailOptions, function (err, info) {
            if (err) console.error(err);
            else {
              console.log('Message sent: ');
              console.log(info);
            }
          });
        });

      });

      requested.forEach(function (app) {
        var body = "<style>div{font:10pt Arial;}</style>";

        var rawId = app.id;

        app.id = utils.parseId(app.id);

        sdp.findOne({id: rawId})
        .populate("subscribers")
        .exec(function(err, data) {
          var subject = "[" + app.name + "] (" + app.id + ") <" + app.status + "> "  + temp_date + " " + monthArray[temp_month] + " " + temp_year;
          // **email body
          body += "<div><b> New apps arrive:</b><br /><br />";

          body += "<b>" + app.name + "[" + app.id + "]</b> with status - <b>" + app.status + "</b><br /><br />";

          if (data.story) {
            body += "<b>Gate Review Story:</b> http://hlm.lge.com/issue/browse/" + data.story + "<br /><br />";
          }
          if (data.issue) {
            body += "<b>Gate Review Issues: </b> http://hlm.lge.com/issue/browse/" + data.issue + "<br />";
          }

          body += "<br /><div>If you need assistance, have questions or want unsubscribe please contact <b>Grigory Skakun</b> (grigory.skakun@lge.com)</div>";
          // **end of email body

          var ccList = wspace.mail.cc.slice();
          var subArray = [];
          if(data.subscribers.length > 0) {
            for(var i=0; i < data.subscribers.length; i++) {
              subArray.push(data.subscribers[i].mail);
            }
          }

          ccList = ccList.concat(subArray);

          var mailOptions = {
            from: wspace.mail.from,
            to: wspace.mail.to,
            cc: ccList,
            subject: subject,
            replyTo: wspace.mail.replyTo,
            text: body,
            html: body,
          };
          transport.sendMail(mailOptions, function (err, info) {
            if (err) console.error(err);
            else {
              console.log('Message sent: ');
              console.log(info);
            }
          });
        });

        });
      approved.forEach(function(app) {
        var body = "<style>div{font:10pt Arial;}</style>";

        var rawId = app.id;

        app.id = utils.parseId(app.id);

        sdp.findOne({id: rawId})
        .populate("subscribers")
        .exec(function(err, data) {
          var subject = "[" + app.name + "] (" + app.id + ") <" + app.status + "> "  + temp_date + " " + monthArray[temp_month] + " " + temp_year;
          // **email body
          body += "<div><b>" + app.name + "[" + app.id + "]</b><b> was succesfully approved.</b><br /><br />";

          if (data.story) {
            body += "<b>Gate Review Story: </b> http://hlm.lge.com/issue/browse/" + data.story + "<br />";
          }
          if (data.issue) {
            body += "<b>Gate Review Issues: </b> http://hlm.lge.com/issue/browse/" + data.issue + "<br />";
          }

          body += "<br /><div>If you need assistance, have questions or want unsubscribe please contact <b>Grigory Skakun</b> (grigory.skakun@lge.com)</div>";

          // **end of email body
          console.log(data);

          var ccList = wspace.mail.cc.slice();
          var subArray = [];
          if(data.subscribers.length > 0) {
            for(var i=0; i < data.subscribers.length; i++) {
              subArray.push(data.subscribers[i].mail);
            }
          }

          ccList = ccList.concat(subArray);

          console.log(subArray, ccList);

          var mailOptions = {
            from: wspace.mail.from,
            to: wspace.mail.to,
            cc: ccList,
            subject: subject,
            replyTo: wspace.mail.replyTo,
            text: body,
            html: body,
          };
          transport.sendMail(mailOptions, function (err, info) {
            if (err) console.error(err);
            // else {
              // console.log('Message sent: ');
              // console.log(info);
            // }
          });
        });
      });
    }, 2e3);
  });
};
