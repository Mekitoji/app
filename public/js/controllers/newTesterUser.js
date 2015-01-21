angular.module('newTester', [])

.controller('cisCtrl', function ($scope, $http, cisTester, User) {
  $scope.cisData = {};

  User.get()

  .success(function (data) {
    $scope.users = data;
  });

  cisTester.get()
    .success(function (data) {
      $scope.cisTesterData = data;
    });

  //create new tester
  $scope.createTester = function () {
    console.log($scope.cisData);

    cisTester.createTester($scope.cisData)
      .success(function (data) {
        $scope.cisTesterData = data;
        $scope.cisData = {};
      });
  };

})

.controller('euCtrl ', function ($scope, $http, euTester) {
  $scope.euData = {};

  User.get()

  .success(function (data) {
    $scope.users = data;
  });

  euTester.get()
    .success(function (data) {
      $scope.euTesterData = data;
    });

  //create new tester
  $scope.createTester() = function () {
    euTester.createTester($scope.euData)
      .success(function (data) {
        $scope.euData = data;
        $scope.euTesterData = {};
      });
  };

});