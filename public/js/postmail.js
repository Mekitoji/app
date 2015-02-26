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

.factory('Apps', function ($http) {
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

.controller('post', function ($scope, $http, mail, Apps) {
  $scope.tag = [];
  //get all app in work
  Apps.get()

  .success(function (data) {
    $scope.apps = data;
    $scope.previewText = '<style type="text/css">.red{background-color:#F00;} table, table th, table td{border:1px solid black;padding:10px;border-collapse:collapse;padding:1px 5px 1px 6px;font:10pt Arial;} .mail-page {font:10pt Arial;} </style>\n\n\n<div class="mail-page">\n\n\nDear Ted,<br />\nHere I summarize those apps that are on App QA team.\n\n' +
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

    $scope.previewText += "\n</table><br />\n\nHere I summarize those apps that are on CIS team.<br /><br />\n\n <table border='1' cellspacing=\'0\' cellpadding=\'0\'>\n\t<tr>\n\t\t<th><b>Country</b></th>\n\t\t<th><b>Application Id</b></th>\n\t\t<th><b>Application name</b></th>\n\t\t<th><b>SDP Status</b></th>\n\t\t<th><b>Update Date</b></th>\n\t\t<th><b>Seller</b></th>\n\t\t<th><b>Current status</b></th>\n\t\t<th><b>Resp</b></th>\n\t</tr>";

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
    $scope.previewText += "\n</table><br />\n\nIn case of any questions please don’t hesitate to ask. <br /><br />\n\n" +
      "Best wishes. <br />\n\n\n</div>";

    $scope.submit = function () {
      console.log($scope.previewText);
      var region = document.URL.split('/')[3];
      mail.post({
        "text": $scope.previewText
      })

      .success(window.location = "/" + region + "/mailSuccess");

    };
  });
});