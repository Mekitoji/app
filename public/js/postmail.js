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
    $scope.previewText = 'Dear Ted,<br />Here I summarize those apps that are on App QA team.' +
      '<style type="text/css">.red{background-color:red;} table, table th, table td{border:1px solid black;padding:10px;border-collapse:collapse;}</style> <br /> <br /> <table border=\'1\'  cellspacing=\'0\' cellpadding=\'0\'><tr><th><b>COUNTRY</b></th><th><b>APP</b></th><th><b>STATUS</b></th><th><b>Update Date</b></th><th><b>SELLER</b></th><th><b>Comments</b></th></tr>';
    _.each($scope.apps, function (num) {
      _.each(num, function (data, key) {

        if (key == 'color' && data == 'purple') {
          console.log(num);
          var temp = new Date(num.updateTime);
          var temp_date = temp.getDate();
          var temp_month = temp.getMonth() + 1;
          var temp_year = temp.getFullYear();

          //here start
          var classx = 'currentDate ';
          var date1 = (new Date()).getTime();
          var minus = date1 - new Date(num.updateTime).getTime();
          console.log(minus);
          if (minus > 604800000) {
            classx += 'red';
          }
          num.updateTime = temp_year + "-" + temp_month + "-" + temp_date;
          $scope.previewText += "<tr><td>" + num.country + "</td><td>" + num.appName + "</td><td>" + num.sdpStatus + "</td><td class='" + classx + "'>" + num.updateTime + "</td><td>" + num.seller + "</td><td>" + num.currentStatus + "</td></tr>";
        }
      });
    });

    $scope.previewText += "</table><br />Here I summarize those apps that are on CIS team. <br /><br /><table border='1' cellspacing=\'0\' cellpadding=\'0\'><tr><th><b>COUNTRY</b></th><th><b>APP</b></th><th><b>STATUS</b></th><th><b>Update Date</b></th><th><b>SELLER</b></th><th><b>Comments</b></th></tr>";

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
      "Best wishes. <br />";

    $scope.submit = function () {
      console.log($scope.previewText);
      mail.post({
        "text": $scope.previewText
      })

      .success(alert("Mail sent successfully!"));

    };
  });
});