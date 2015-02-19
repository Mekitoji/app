var newTester = angular.module('newTester', []);

newTester.controller('cisCtrl', function ($scope, cisTester, User) {
  $scope.cisData = {};

  User.get()

  .success(function (data) {
    $scope.users = data;
  });

  cisTester.get()
    .success(function (data) {
      $scope.cisTesterData = data;
      console.log(data);
    });

  //create new tester
  $scope.createTester = function () {
    cisTester.createTester($scope.cisData)
      .success(function (data) {
        $scope.cisTesterData = data;
        $scope.cisData = {};
      });
  };

});

newTester.controller('euCtrl', function ($scope, euTester, User) {
  $scope.euData = {};

  User.get()

  .success(function (data) {
    $scope.users = data;
  });

  euTester.get()
    .success(function (data) {
      $scope.euTesterData = data;
      console.log(data);
    });

  //create new tester
  $scope.createTester = function () {
    euTester.createTester($scope.euData)
      .success(function (data) {
        $scope.euTesterData = data;
        $scope.euData = {};
      });
  };

});

newTester.controller('sandboxCtrl', function ($scope, sandboxTester, User) {
  $scope.sandboxData = {};

  User.get()

  .success(function (data) {
    $scope.users = data;
  });

  sandboxTester.get()
    .success(function (data) {
      $scope.sandboxTesterData = data;
      console.log(data);
    });

  //create new tester
  $scope.createTester = function () {
    sandboxTester.createTester($scope.sandboxData)
      .success(function (data) {
        $scope.sandboxTesterData = data;
        $scope.sandboxData = {};
      });
  };

});