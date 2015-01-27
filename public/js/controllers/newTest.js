angular.module('project')

.controller('newCycleCtrl', function($scope, $http, Apps, iTester) {
  Apps.get()
    .success(function(apps) {
      $scope.apps = apps;
      $scope.temps = [];
      for (var i = 0; i < apps.length; i++) {
        $scope.temps[i] = apps[i].appName;
      }
    });

  iTester.get()
    .success(function(testers) {
      $scope.testers = testers;
      // $scope.testersName = [];
      // for (var i = 0; I < app.length; i++) {
      //   $scope.testersName[i] = testers[i].name;
      // }
    });

  $scope.createNewTestCycle = function() {
    // $scope.testCycle.tester
    console.log($scope.testCycle);
    console.log($scope.testCycle.tester._id._id);
    iTester.update($scope.testCycle.tester._id._id, $scope.testCycle)
      .success(function(data) {
        $scope.testerDatas = data;
        $scope.testCycle = {};
      });
  };

});