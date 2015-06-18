angular.module('history-project')

.controller('kpi-list', function ($scope, History, $http) {
  $scope.filter          = {}
  $scope.currentRegion   = document.location.pathname.split('/')[1];
  $scope.currentLocation = document.location.pathname.split('/')[3]
  $scope.currentYear     = $scope.currentLocation.split("-")[2];
  $scope.filter.year     = $scope.currentYear;
  $scope.users           = {};
  $scope.loading         = true;

  $http.get("/api/users")
  .success(function(user) {
    _.each(user, function(v) {
      var local = v.local;
      $scope.users[v._id] = local;
    });
  });

  $scope.year = [2015, 2016, 2017, 2018, "all"];
  History.getByDate($scope.currentLocation)
    .success(function (testers) {
      $scope.testers = testers.testerStat;
      $scope.kpi     = [];

      _.each($scope.year, function (year) {
        _.each($scope.testers, function (v) {
          var url = "tester/" + v._id;
          if(v.user == null) {
            v.user = {local:{username:{first:"",last:""}}};
          }
          var total = {
            id: v.name,
            username: $scope.users[v.user].username.first + " " + $scope.users[v.user].username.last,
            year: year,
            respTime: 0,
            testCycles: 0,
            countResp: 0,
            countCycle: 0,
            url: url,
          };
          _.each(v.appStorage, function (z) {
          if (year === z.year || year ==="all") {
            z.year = "all";
            if (z.app === null) {
              z.app = {}
            }

            if (z.respTime !== 0) {
              total.countResp++;
              total.respTime += z.respTime;
            }

            if (z.app.tv === "Approved" || z.app.tv === "Partial") {
              total.testCycles += z.testCycle;
              total.countCycle++;
            }
          }
          });
          total.respTime   = total.respTime / total.countResp;
          total.testCycles = total.testCycles / total.countCycle;
          total.respTime   = total.respTime.toFixed(2)
          total.testCycles = total.testCycles.toFixed(2)
          if(isNaN(total.respTime)) {
            total.respTime = "N/A";
          }
          if(isNaN(total.testCycles)) {
            total.testCycles = "N/A";
          }
          $scope.kpi.push(total);
        });
      });
    })

    .finally(function() {
      $scope.loading = false;
    });
});