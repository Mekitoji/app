angular.module('project')

.controller('newCycleCtrl', function ($scope, $http, Apps, iTester) {
  Apps.getRejected()
    .success(function (apps) {
      $scope.apps = apps;
      $scope.temps = [];
      for (var i = 0; i < apps.length; i++) {
        $scope.temps.push({
          _id: apps[i]._id,
          appName: apps[i].appName,
          applicationId: apps[i].applicationId,
          year: apps[i].year,
        });
        $scope.temps = _.sortBy($scope.temps, function (i) {
          return i.appName.toLowerCase();
        });
      }
    });

  iTester.get()
    .success(function (testers) {
      $scope.testers = testers;
      // $scope.testersName = [];
      // for (var i = 0; I < app.length; i++) {
      //   $scope.testersName[i] = testers[i].name;
      // }
    });

  $scope.createNewTestCycle = function () {
    // $scope.testCycle.tester
    $scope.testCycle = {
      tester: $scope.tester,
      reason: $scope.reason,
      appNameTest: $scope.appNameTest,
      date: $scope.date
    };
    iTester.update($scope.testCycle.tester._id, $scope.testCycle)
      .success(function (data) {
        $scope.testerDatas = data;
        $scope.testCycle = {};
      });
  };

});