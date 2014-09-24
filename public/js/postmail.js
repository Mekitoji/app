/**
 * postmail Module
 *
 * Post mail to Korea
 */
angular.module('postmail', [])

.factory('mail', function ($http) {
  return {
    post: function (data) {
      return $http.post('/postmail', data);
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
      return $http.get('/api/gk/');
    },
    getApproved: function () {
      return $http.get('/api/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/gk/outdated');
    },
  };
})

.controller('post', function ($scope, $http, mail, Apps) {
  $scope.tag = [];
  //get all app in work
  Apps.get()

  .success(function (data) {
    $scope.apps = data;
    $scope.previewText = 'Dear Ted,In attachment you can find CIS Gate Keeper status report, and here I summarize those apps that are on App QA team.' +
      '<style type="text/css">table, table th, table td{border:1px solid black}</style>  <table><tr><th><b>COUNTRY</b></th><th><b>APP</b></th><th><b>STATUS</b></th><th><b>Update Time</b></th><th><b>SELLER</b></th><th><b>Comments</b></th></tr>';
    _.each($scope.apps, function (num) {
      _.each(num, function (data, key) {

        if (key == 'color' && data == 'purple') {
          console.log(num);
          var temp = new Date(num.updateTime);
          var temp_date = temp.getDate();
          var temp_month = temp.getMonth() + 1;
          var temp_year = temp.getFullYear();
          num.updateTime = temp_year + "-" + temp_month + "-" + temp_date;
          $scope.previewText += "<tr><td>" + num.country + "</td><td>" + num.appName + "</td><td>" + num.sdpStatus + "</td><td>" + num.updateTime + "</td><td>" + num.seller + "</td><td>" + num.currentStatus + "</td></tr>";
        }
      });
    });

    $scope.previewText += "</table>Here I summarize those apps that are on CIS team. <br /><table><tr><th><b>COUNTRY</b></th><th><b>APP</b></th><th><b>STATUS</b></th><th><b>Update Time</b></th><th><b>SELLER</b></th><th><b>Comments</b></th></tr>";

    _.each($scope.apps, function (num) {
      _.each(num, function (data, key) {

        if (key == 'color' && data == 'red' || data == 'orange') {

          var temp = new Date(num.updateTime);
          var temp_date = temp.getDate();
          var temp_month = temp.getMonth() + 1;
          var temp_year = temp.getFullYear();
          num.updateTime = temp_year + "-" + temp_month + "-" + temp_date;
          $scope.previewText += "<tr><td>" + num.country + "</td><td>" + num.appName + "</td><td>" + num.sdpStatus + "</td><td>" + num.updateTime + "</td><td>" + num.seller + "</td><td>" + num.currentStatus + "</td></tr>";
        }
      });
    });
    $scope.previewText += "</table><br />In case of any questions please don’t hesitate to ask. <br /><br />" +
      "Thanks. <br />" +
      "Andrey Sayants <br />" +
      "CIS TV CAS Part | CDV Team <br />" +
      "<b>LG Electronics Russia R&D Lab</b> <br />" +
      "Tel: +7-812-329-9219, #259 <br />" +
      "E-mail: andrey.sayants@lge.com";

    $scope.submit = function () {
      console.log($scope.previewText);
      mail.post({
        "text": $scope.previewText
      });
    };
  });
});