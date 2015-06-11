angular.module('project')

.controller('kpi-list', function ($scope, iTester) {
  $scope.year = [2015, 2016, 2017, 2018, "all"];

  iTester.get()
    .success(function (testers) {
      $scope.testers = testers;
      console.log(testers)
      $scope.kpi = [];
      // $scope.year = document.location.pathname.split('/')[2];
      _.each($scope.year, function (year) {
        _.each($scope.testers, function (v) {
          var total = {
            id: v.name,
            username: v.user.local.username.first + " " + v.user.local.username.last,
            year: year,
            respTime: 0,
            testCycles: 0,
            countResp: 0,
            countCycle: 0
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
          console.log(total);
          $scope.kpi.push(total);
        });
      });
    });
});