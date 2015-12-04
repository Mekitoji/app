angular.module('project')

.controller('NewTesterCtrl', function ($scope, $http, Apps, Tester) {

  $scope.testCycle = {};
  Apps.get()
    .success(function (apps) {
      $scope.apps = apps;
      $scope.temps = [];
      for (var i = 0; i < apps.length; i++) {
        $scope.temps[i] = apps[i].appName;
      }
      console.log($scope.temps);
    });

  Tester.get()
    .success(function (tester) {
      $scope.testerDatas = tester;
    });

  $scope.createNewTestCycle = function () {
    // $scope.testCycle.tester
    console.log($scope.Tester1._id);
    console.log($scope.testCycle);
    Tester.update($scope.Tester1._id, $scope.testCycle)
      .success(function (data) {
        $scope.testerDatas = data;
        $scope.testCycle = {};
      });
  };
});
