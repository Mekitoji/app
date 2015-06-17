angular.module('project')

.directive('popover', function() {
  return function(scope, elem) {
    elem.popover();
  }
})

.filter('toLocale', function () {
  return function (item) {
    return new Date(item).toLocaleDateString();
  };
})

.controller('kpi-profile', function ($scope, iTester) {

  var path = document.location.pathname.split('/');
  $scope.currentYear   = path[2];
  $scope.currentRegion = path[1];
  $scope.currentTester = path[4]

  $scope.kpi           = [];
  $scope.filter        = {};
  $scope.filter.year   = $scope.currentYear;
  $scope.tester        = {};
  $scope.total         = [];
  $scope.loading       = true;

  $scope.year = [2015, 2016, 2017, 2018, "all"];
  iTester.get()
  .success(function (testers) {
    $scope.tester = _.where(testers, {"_id": $scope.currentTester})[0];
    _.each($scope.year, function(year) {
        var total = {respTime: 0, testCycles: 0, countResp: 0, countCycle: 0, year: year};
      _.each($scope.tester.appStorage, function(v) {

        if(v.year === year || year ==="all") {
          var app = {
            reviewTime: v.respTime,
            testCycle: v.testCycle,
            data: v.app,
            year: year,
            color: "",
          }

          $scope.kpi.push(app);

          if (v.respTime !== 0) {
            total.countResp++;
            total.respTime += v.respTime;
          }

          if (v.app.tv === "Approved" || v.app.tv === "Partial") {
            total.testCycles += v.testCycle;
            total.countCycle++;
            app.color ="green"
          }
        }
      });
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
      $scope.total.push(total);
    });
    console.log($scope.total);
    console.log($scope.kpi);
    $scope.kpi.sort(function(a, b) {
      if(a.data.appName<b.data.appName) return -1;
      if(a.data.appName>b.data.appName) return 1;
      return 0;
    });
  })

  .finally(function() {
    $scope.loading = false;
  });
});