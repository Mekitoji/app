/**
 * postmail Module
 *
 * Post mail to Korea
 */
angular.module('postmail', [])

.factory('mail', function ($http) {
  return {
    post: function (data) {
      return $http.post('/cis/postmail', data);
    }
  };
})

.filter('unsafe', function ($sce) {
  return function (val) {
    return $sce.trustAsHtml(val);
  };
})

.factory('AppsCIS', function ($http) {
  return {
    get: function () {
      return $http.get('/api/cis/gk/');
    },
    getApproved: function () {
      return $http.get('/api/cis/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/cis/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/cis/gk/outdated');
    },
    getCalendar: function () {
      return $http.get('/api/cis/calendar/rejected');
    },
  };
})

.factory('AppsEU', function ($http) {
  return {
    get: function () {
      return $http.get('/api/eu/gk/');
    },
    getApproved: function () {
      return $http.get('/api/eu/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/eu/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/eu/gk/outdated');
    },
    getCalendar: function () {
      return $http.get('/api/eu/calendar/rejected');
    },
  };
})

.factory('AppsSandbox', function ($http) {
  return {
    get: function () {
      return $http.get('/api/global/gk/');
    },
    getApproved: function () {
      return $http.get('/api/global/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/global/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/global/gk/outdated');
    },
    getCalendar: function () {
      return $http.get('/api/global/calendar/rejected');
    },
  };
})

.factory('AppsSIA', function ($http) {
  return {
    get: function () {
      return $http.get('/api/sia/gk/');
    },
    getApproved: function () {
      return $http.get('/api/sia/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/sia/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/sia/gk/outdated');
    },
    getCalendar: function () {
      return $http.get('/api/sia/calendar/rejected');
    },
  };
})
.factory('AppsCISEU', function ($http) {
  return {
    get: function () {
      return $http.get('/api/ciseu/gk/');
    },
    getApproved: function () {
      return $http.get('/api/ciseu/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/ciseu/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/ciseu/gk/outdated');
    },
    getCalendar: function () {
      return $http.get('/api/ciseu/calendar/rejected');
    },
  };
})
.controller('post', function ($scope, $http, mail, AppsCIS, AppsEU, AppsSIA, AppsSandbox, AppsCISEU) {
  $scope.url = document.location.origin;
  $scope.year = (new Date()).getFullYear();

  $scope.tag = [];
  //get all app in work
  var Apps;
  var gk = {};
  var route = window.location.pathname.split('/')[1];

  //TODO:Go to db instead of memory
  //create enviroment for all region workspace

  if (route === 'cis') {
    Apps = AppsCIS;
    gk = {
      "DP": "Dmitry Politaev",
      "AS": "Andrey Sayants",
      "VE": "Vladimir Egorov",
      "YK": "Yury Kirillov",
    }
  } else if (route === 'eu') {
    Apps = AppsEU;
    gk = {
      "SR": "Rastaturin Stanislav",
      "NT": "Treschalov Nikita",
      "EK": "Kipovskiy Evgeniy",
      "AB": "Belousov Alexey",
      "MF": "Filimonov Maxim",
      "GS": "Skakun Grigory",
    }
  } else if (route === 'global') {
    Apps = AppsSandbox
  } else if (route === 'sia') {
    Apps = AppsSIA;
  } else if (route === 'ciseu') {
    Apps = AppsCISEU;
    gk = {
      "SR": "Rastaturin Stanislav",
      "EK": "Kipovskiy Evgeniy",
      "AB": "Belousov Alexey",
      "GS": "Skakun Grigory",
      "AS": "Andrey Sayants",
      "RT": "Roman Turchenko",
    }
  }
  //TODO: make different message preset for all region

  Apps.get()

  .success(function (data) {

    $scope.apps = data;
    var cdate = formatDate(new Date());

    $scope.previewText = '<style type="text/css">.red{background-color:#F00;} table, table th, table td{border:1px solid black;padding:10px;border-collapse:collapse;padding:1px 5px 1px 6px;font:10pt Arial;} .mail-page {font:10pt Arial;} </style>\n\n\n<div class="mail-page">\n\n\nDear colleagues,<br><br>Please check the latest STE report.<br><br>\n<b>Priority apps waiting for QA in Korea</b>\n\n' +
      '<br /> <br /> \n\n<table border=\'1\'  cellspacing=\'0\' cellpadding=\'0\'>\n\t<tr>\n\t\t<th><b>Country</b>\n\t\t<th><b>Application Id</b></th>\n\t\t<th><b>Application name</b></th>\n\t\t<th><b>SDP Status</b></th>\n\t\t<th><b>Update Date</b></th>\n\t\t<th><b>Seller</b></th>\n\t\t<th><b>Current Status</b></th>\n\t\t<th><b>Resp</b></th>\n\t</tr>\n';

      var emptyQA = true;
    _.each($scope.apps, function (num) {
      _.each(num, function (data, key) {

        if (key == 'color' && data == 'purple') {
          if (num.tv === 'In Progress' && num.outdated === false) {
            emptyQA = false;
            var temp = new Date(num.updateTime);
            var temp_date = temp.getDate();
            var temp_month = temp.getMonth() + 1;
            var temp_year = temp.getFullYear();
            temp_date = temp_date.toString();
            if (temp_date.toString().length === 1) {
              temp_date = '0' + temp_date;
            }
            if (temp_month.toString().length === 1) {
              temp_month = '0' + temp_month;
            }
            //here start
            var classx = 'currentDate ';
            var date1 = (new Date()).getTime();
            var minus = date1 - new Date(num.updateTime).getTime();
            var bgcolor = '';
            if (minus > 604800000) {
              bgcolor = 'bgcolor="red"';
            }
            num.updateTime = temp_year + "-" + temp_month + "-" + temp_date;
            var resp = gk[num.resp] ? gk[num.resp] : num.resp;
            $scope.previewText += "\t<tr>\n\t\t<td>" + num.country + "</td>\n\t\t<td>" + num.applicationId + "</td>\n\t\t<td>" + num.appName + "</td>\n\t\t<td>" + num.sdpStatus + "</td>\n\t\t<td class='" + classx + "' " + bgcolor + ">" + num.updateTime + "</td>\n\t\t<td>" + num.seller + "</td>\n\t\t<td>" + num.currentStatus + "</td>\n\t\t<td>" + resp + "</td>\n\t</tr>";
          }
        }
      });
    });
    if(emptyQA) {
      $scope.previewText += "<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>";
    }

    $scope.previewText += "\n</table><br />\n\n<b>Priority apps waiting for STE review</b><br /><br />\n\n <table border='1' cellspacing=\'0\' cellpadding=\'0\'>\n\t<tr>\n\t\t<th><b>Country</b></th>\n\t\t<th><b>Application Id</b></th>\n\t\t<th><b>Application name</b></th>\n\t\t<th><b>SDP Status</b></th>\n\t\t<th><b>Update Date</b></th>\n\t\t<th><b>Seller</b></th>\n\t\t<th><b>Current status</b></th>\n\t\t<th><b>Resp</b></th>\n\t</tr>";

    var emptySTE = true;
    Apps.getCalendar()
      .success(function (c) {
        _.each($scope.apps, function (num) {
          _.each(num, function (data, key) {
            if (key == 'color' && data == 'red' || data == 'orange') {
              if (num.tv === "In Progress" && num.outdated === false) {
                // console.log(num);
                emptySTE = false;
                var bg_color = "";
                var mapC = createMap(num, c);
                var cc = checkAppDate(cdate, mapC);
                console.log(cc);
                if(cc) {
                  bg_color = 'bgcolor="red"';
                }
                var temp = new Date(num.updateTime);
                var temp_date = temp.getDate();
                var temp_month = temp.getMonth() + 1;
                var temp_year = temp.getFullYear();
                if (temp_date.toString().length === 1) {
                  temp_date = '0' + temp_date;
                }
                if (temp_month.toString().length === 1) {
                  temp_month = '0' + temp_month;
                }
                num.updateTime = temp_year + "-" + temp_month + "-" + temp_date;
                var resp = gk[num.resp] ? gk[num.resp] : num.resp;
                $scope.previewText += "\n\t<tr>\n\t\t<td>" + num.country + "</td>\n\t\t<td>" + num.applicationId + '</td>\n\t\t<td>' + num.appName + "</td>\n\t\t<td>" + num.sdpStatus + "</td>\n\t\t<td " + bg_color + ">" + num.updateTime + "</td>\n\t\t<td>" + num.seller + "</td>\n\t\t<td>" + num.currentStatus + "</td>\n\t\t<td>" + resp + "</td>\n\t\t</tr>";
              }
            }
          });
        });
        if(emptySTE) {
          $scope.previewText += "<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>";
        }

        $scope.region = document.URL.split('/')[3];

        function generateChartName() {
          var d = new Date();
          var dd = d.getDate();
          var dm = d.getMonth() + 1;
          var dy = d.getFullYear();
          var result = '' + dd + '-' + dm + '-' + dy + '-chart.png';
          return result;
        }

        $scope.previewText += "\n</table><br />\n\n" +
          "You can now check current Pass Rate in <a href=" + $scope.url + "/" + $scope.region + "/" + $scope.year + "/rejected#/inwork >GK Control System</a> as well as detailed statistics. In case you don't have access, reply to this email and request authority." +
          "<br><a href='" + $scope.url + "/" + $scope.region + "/" + $scope.year + "/tester'><img width='480' src='" + $scope.url + "/images/charts/" + generateChartName() +"'></a><br><br>" +
          "Best wishes, <br />\n\n\n CIS STE Team<br><br>" +
          "<small>This message is automatically generated by GK Control. If you don’t have access – please send a request to andrey.sayants@lge.com.<br>For more information on GK Control, see: http://collab.lge.com/main/display/GKSPRTCOMM/Gate+Keeper+Control+User+Manual</small></div>";

        $scope.submit = function () {
          var d = new Date();
          var year = d.getFullYear();
          var region = document.URL.split('/')[3];
          mail.post({
            "text": $scope.previewText
          })

          .success(window.location = "/" + region + "/" + year + "/mailSuccess");
        };
      });
  });
});

function createMap(app, c) {
  var storageMap = [];
  _.each(c, function (ca) {
    if (ca.appId._id === app._id) {
      _.each(ca.storage, function (cd) {
        storageMap[cd.fullDate] = cd.value;
      });
    }
  });
  return storageMap;
}

function checkAppDate(cdate, map) {
  var LIMIT = 14;
  var DAY_COUNT = 2;
  var prevDate = new Date();
  prevDate.setDate(prevDate.getDate() - 1);
  var fDate = formatDate(prevDate);
  switch (map[cdate]) {
  case "L":
  case "H":
  case "D":
    return false;
    break;
  default:

    var count = 0;
    for (var i = 0; i <= LIMIT; i++) {
      switch (map[fDate]) {
      case "H":
      case "D":
      case "L":
        return false;
        break;
      case "LL":
        count++;
        if (count >= DAY_COUNT) {
          return true;
        }
        break;
      default:
        break;
      }
      prevDate.setDate(prevDate.getDate() - 1);
      fDate = formatDate(prevDate);
    }
    return false;
    break
  }
}

function formatDate(dx) {
  var dd = dx.getDate();
  var dm = dx.getMonth() + 1;
  var dy = dx.getFullYear();

  if (dd.toString().length === 1) {
    dd = '0' + dd;
  }

  if (dm.toString().length === 1) {
    dm = '0' + dm;
  }

  var d = dy + "-" + dm + "-" + dd;
  return d;
}
