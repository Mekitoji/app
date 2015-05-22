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
  };
})

.controller('post', function ($scope, $http, mail, AppsCIS, AppsEU, AppsSIA, AppsSandbox) {
  $scope.url = document.location.origin;
  $scope.year = (new Date()).getFullYear();

  $scope.tag = [];
  //get all app in work
  var Apps;
  var route = window.location.pathname.split('/')[1];
  if (route === 'cis') {
    Apps = AppsCIS;
  } else if (route === 'eu') {
    Apps = AppsEU;
  } else if (route === 'global') {
    Apps = AppsSandbox
  } else if (route === 'sia') {
    Apps = AppsSIA;
  }
  //TODO: make different message for all region

  Apps.get()

  .success(function (data) {
    $scope.apps = data;
    $scope.previewText = '<style type="text/css">.red{background-color:#F00;} table, table th, table td{border:1px solid black;padding:10px;border-collapse:collapse;padding:1px 5px 1px 6px;font:10pt Arial;} .mail-page {font:10pt Arial;} </style>\n\n\n<div class="mail-page">\n\n\nDear colleagues,<br><br>Please check the latest STE report.<br><br>\n<b>Priority apps waiting for QA in Korea</b>\n\n' +
      '<br /> <br /> \n\n<table border=\'1\'  cellspacing=\'0\' cellpadding=\'0\'>\n\t<tr>\n\t\t<th><b>Country</b>\n\t\t<th><b>Application Id</b></th>\n\t\t<th><b>Application name</b></th>\n\t\t<th><b>SDP Status</b></th>\n\t\t<th><b>Update Date</b></th>\n\t\t<th><b>Seller</b></th>\n\t\t<th><b>Current Status</b></th>\n\t\t<th><b>Resp</b></th>\n\t</tr>\n';
    _.each($scope.apps, function (num) {
      _.each(num, function (data, key) {

        if (key == 'color' && data == 'purple') {
          if (num.tv === 'In Progress' && num.outdated === false) {
            console.log(num);
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
            console.log(minus);
            if (minus > 604800000) {
              bgcolor = 'bgcolor="red"';
            }
            num.updateTime = temp_year + "-" + temp_month + "-" + temp_date;
            $scope.previewText += "\t<tr>\n\t\t<td>" + num.country + "</td>\n\t\t<td>" + num.applicationId + "</td>\n\t\t<td>" + num.appName + "</td>\n\t\t<td>" + num.sdpStatus + "</td>\n\t\t<td class='" + classx + "' " + bgcolor + ">" + num.updateTime + "</td>\n\t\t<td>" + num.seller + "</td>\n\t\t<td>" + num.currentStatus + "</td>\n\t\t<td>" + num.resp + "</td>\n\t</tr>";
          }
        }
      });
    });

    $scope.previewText += "\n</table><br />\n\n<b>Priority apps waiting for STE review</b><br /><br />\n\n <table border='1' cellspacing=\'0\' cellpadding=\'0\'>\n\t<tr>\n\t\t<th><b>Country</b></th>\n\t\t<th><b>Application Id</b></th>\n\t\t<th><b>Application name</b></th>\n\t\t<th><b>SDP Status</b></th>\n\t\t<th><b>Update Date</b></th>\n\t\t<th><b>Seller</b></th>\n\t\t<th><b>Current status</b></th>\n\t\t<th><b>Resp</b></th>\n\t</tr>";

    _.each($scope.apps, function (num) {
      _.each(num, function (data, key) {

        if (key == 'color' && data == 'red' || data == 'orange') {
          if (num.tv === "In Progress" && num.outdated === false) {
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
            $scope.previewText += "\n\t<tr>\n\t\t<td>" + num.country + "</td>\n\t\t<td>" + num.applicationId + '</td>\n\t\t<td>' + num.appName + "</td>\n\t\t<td>" + num.sdpStatus + "</td>\n\t\t<td>" + num.updateTime + "</td>\n\t\t<td>" + num.seller + "</td>\n\t\t<td>" + num.currentStatus + "</td>\n\t\t<td>" + num.resp + "</td>\n\t\t</tr>";
          }
        }
      });
    });
    $scope.region = document.URL.split('/')[3];

    $scope.previewText += "\n</table><br />\n\n" +
      "To access <b>GK Control system</b> with detailed statistics please click on the screenshot below. In case you don't have access, reply to this email and request authority.<br>" +
      "<a href='"+ $scope.url + "/" + $scope.region + "/" + $scope.year + "/rejected#/inwork'><br><br><img width=480 src='"+ $scope.url +"/images/thumb/sample2.png'></a><br><br>" +
      "Best wishes. <br />\n\n\n</div>";

    $scope.submit = function () {
      console.log($scope.previewText);
      var d = new Date();
      var year = d.getFullYear();
      var region = document.URL.split('/')[3];
      mail.post({
        "text": $scope.previewText
      })

      .success(window.location = "/" + region + "/" + year+ "/mailSuccess");

    };
  });
});