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
    $scope.previewText = 'Dear Ted,<br />Here I summarize those apps that are on App QA team.' +
      '<style type="text/css">.red{background-color:#F00;} table, table th, table td{border:1px solid black;padding:10px;border-collapse:collapse;}</style> <br /> <br /> <table border=\'1\'  cellspacing=\'0\' cellpadding=\'0\'><tr><th><b>COUNTRY</b><th><b>App Id</b></th></th><th><b>APP</b></th><th><b>STATUS</b></th><th><b>Update Date</b></th><th><b>SELLER</b></th><th><b>Comments</b></th><th><b>Resp</b></th></tr>';
    _.each($scope.apps, function (num) {
      _.each(num, function (data, key) {

        if (key == 'color' && data == 'purple') {
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
            temp_date = '0' + temp_date;
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
          $scope.previewText += "<tr><td>" + num.country + "</td><td>" + num.applicationId + "</td><td>" + num.appName + "</td><td>" + num.sdpStatus + "</td><td class='" + classx + "' " + bgcolor + ">" + num.updateTime + "</td><td>" + num.seller + "</td><td>" + num.currentStatus + "</td><td>" + num.resp + "</td></tr>";
        }
      });
    });

    $scope.previewText += "</table><br />Here I summarize those apps that are on CIS team. <br /><br /><table border='1' cellspacing=\'0\' cellpadding=\'0\'><tr><th><b>COUNTRY</b></th><th><b>App Id</b></th><th><b>APP</b></th><th><b>STATUS</b></th><th><b>Update Date</b></th><th><b>SELLER</b></th><th><b>Comments</b></th><th><b>Resp</b></th></tr>";

    _.each($scope.apps, function (num) {
      _.each(num, function (data, key) {

        if (key == 'color' && data == 'red' || data == 'orange') {

          var temp = new Date(num.updateTime);
          var temp_date = temp.getDate();
          var temp_month = temp.getMonth() + 1;
          var temp_year = temp.getFullYear();
          if (temp_date.toString().length === 1) {
            temp_date = '0' + temp_date;
          }
          if (temp_month.toString().length === 1) {
            temp_date = '0' + temp_date;
          }
          num.updateTime = temp_year + "-" + temp_month + "-" + temp_date;
          $scope.previewText += "<tr><td>" + num.country + "</td><td>" + num.applicationId + '</td><td>' + num.appName + "</td><td>" + num.sdpStatus + "</td><td>" + num.updateTime + "</td><td>" + num.seller + "</td><td>" + num.currentStatus + "</td><td>" + num.resp + "</td></tr>";
        }
      });
    });
    $scope.previewText += "</table><br />In case of any questions please don’t hesitate to ask. <br /><br />" +
      "Best wishes. <br />";

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