angular.module('project')

.controller('kpi-profile', function ($scope, iTester) {

  var path = document.location.pathname.split('/');
  $scope.currentYear = path[2];
  $scope.currentRegion = path[1];
  $scope.currentTester = path[4]

  $scope.filter = {}
  $scope.filter.year= $scope.currentYear;

  $scope.year = [2015, 2016, 2017, 2018, "all"];
  iTester.get()

  .success(function (testers) {
      $scope.testers = testers;
      $scope.kpi = [];
      _.each($scope.year, function (year) {
        _.each($scope.testers, function (v) {
          var url = "tester/" + v._id;
          var total = {
            id: v.name,
            username: v.user.local.username.first + " " + v.user.local.username.last,
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
          // console.log(total)
          total.respTime = total.respTime / total.countResp;
          total.testCycles = total.testCycles / total.countCycle;
          total.respTime = total.respTime.toFixed(2)
          total.testCycles = total.testCycles.toFixed(2)
          if(isNaN(total.respTime)) {
            total.respTime = "N/A";
          }
          if(isNaN(total.testCycles)) {
            total.testCycles = "N/A";
          }
          // console.log(total);
          $scope.kpi.push(total);
        });
      });
    });
});