var _ = require("lodash");
var Apps, ApprovedApps, Cal;

/**
 * Init object with instructions
 * @type {Object}
 */
var config = {
  headerArr: ['empty', 'appId', 'region', 'gk', 'appName', 'seller', 'updateDate', 'appStatus', 'gkReview'],
  table_caption: "Gate Keeper Review List",
  workspace: {
    "CIS": {
      region: ["CS"],
      gk: {
        "POLITAEVDMITRY": "DP",
        "SayantsAndrey": "AS",
        "EgorovVladimir": "VE",
        "KirillovYury": "YK"
      }
    },
    "EU": {
      region: ["EU"],
      gk: {}
    },
    "ALL": {
      region: ["all"],
      gk: {}
    },
    "SIA": {
      region: ["AA", "HK", "MA", "NA", "TW"],
      gk: {}
    }
  },
  currentWorkspace: null,
};


var utils = {};
/**
 * check if value is null or undefined
 * @param  {[type]}  val value to check
 * @return {Boolean}
 */
utils.isNullOrUndefined = function(val) {
  if (val === null || val === undefined) {
    return true;
  } else {
    return false;
  }
};

/**
 * Show what region data we currently parse, and write it to config
 * @param  {string} Region to parse
 * @return {string|null} Workspace
 */
utils.checkData = function(region, caption, response) {
  //get config clean
  config.currentWorkspace = null;

  _.forEach(config.workspace, function(n, key) {
    _.forEach(n.region, function(r) {
      if(r === region) {
        config.currentWorkspace = key;
        return true;
      }
    });
  });

  if(!utils.isNullOrUndefined(config.currentWorkspace)) {
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
utils.responseToClient = function(res, result, msg, e) {
  var err;
  if(process.env.NODE_ENV !== "development") err = null;
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
utils.interface = function(workspace) {
  if (workspace === "CIS") {
    Apps = require('../../models/CIS/gkbase');
    ApprovedApps = require('../../models/CIS/gkbaseApproved');
    Cal = require('../../models/CIS/calendar');
  } else if(workspace === "EU") {
    Apps = require('../../models/EU/gkbase');
    ApprovedApps = require('../../models/EU/gkbaseApproved');
    Cal = require('../../models/EU/calendar');
  } else if(workspace === "ALL") {
    Apps = require('../../models/Sandbox/gkbase');
    ApprovedApps = require('../../models/Sandbox/gkbaseApproved');
    Cal = require('../../models/Sandbox/calendar');
  } else if(workspace === "SIA") {
    Apps = require('../../models/SIA/gkbase');
    ApprovedApps = require('../../models/SIA/gkbaseApproved');
    Cal = require('../../models/SIA/calendar');
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
utils.getCurrentYear = function() {
  var date = new Date();
  return date.getFullYear();
};

module.exports = function (app) {
  app.post('/api/getJson', function(req, res) {
    var region    = req.body.region;
    var caption   = req.body.table_caption;
    var rawData   = req.body.data;
    var workspace = utils.checkData(region, caption, res);
    var data      = JSON.parse(rawData);
    var p         = [];

    utils.interface(workspace);

    if(utils.isNullOrUndefined(Apps) || utils.isNullOrUndefined(ApprovedApps) || utils.isNullOrUndefined(Cal) || utils.isNullOrUndefined(workspace)) {
      utils.responseToClient(res, false, "Server error; Workspace is null;", null)
    }

    _.forEach(data, function(arr) {
      p.push(_.zipObject(config.headerArr, arr));
    });

    _.forEach(p, function(n) {
      Apps.findOne({
        applicationId: n.appId
      })
      .exec(function(err, app) {
        if (err) utils.responseToClient(res, false, "Server error", err);

        if (app === null && n.appStatus !== "App QA approved" || app !== null && app.year !== utils.getCurrentYear()) {
          var c = config.workspace[config.currentWorkspace];
          var resp = c.gk[n.gk] ? c.gk[n.gk] : "";

          Apps.create({
            appName: n.appName,
            seller : n.seller,
            sdpStatus: n.appStatus,
            tv: "In Progress",
            testCycles: 1,
            updateTime: n.updateDate,
            replyTime: 0,
            resp: resp,
            applicationId: n.appId,
            year: utils.getCurrentYear()
          }, function(err, result){
            if (err) utils.responseToClient(res, false, "Create app failed. ", err);
            Cal.create({
              appId: result._id
            }, function(err) {
              if(err) utils.responseToClient(res, false, "Create calendar failed", err);
              utils.responseToClient(res, true, "Data is succesfully parsed");
            });
          });
        } else if(app !== null) {
          var c = config.workspace[config.currentWorkspace];
          var resp = c.gk[n.gk] ? c.gk[n.gk] : "";
          Apps.findOne({
            applicationId: n.appId
          })
          .exec(function(err, app) {
            if (err) utils.responseToClient(res, false, "Server error", err);

            n.updateDate   = new Date(n.updateDate);
            app.sdpStatus  = n.appStatus;
            app.updateTime = n.updateDate;
            app.resp = resp;
            app.save(function(err) {
              if(err) utils.responseToClient(res, false, "Failed to save data", err);
              utils.responseToClient(res, true, "Apps succesfully updated");
            });
          });
        } else {
          utils.responseToClient(res, true, "QA approved app detected; skip it", null);
        }
      });
    });
  });
};


