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
        });
        $scope.temps = _.sortBy($scope.temps, "appName");
        console.log($scope.temps);
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
    console.log($scope.testCycle);
    console.log($scope.testCycle.tester._id);
    iTester.update($scope.testCycle.tester._id, $scope.testCycle)
      .success(function (data) {
        $scope.testerDatas = data;
        $scope.testCycle = {};
      });
  };

});