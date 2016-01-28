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

newTester.controller('siaCtrl', function ($scope, siaTester, User) {
  $scope.siaData = {};

  User.get()

  .success(function (data) {
    $scope.users = data;
  });

  siaTester.get()
    .success(function (data) {
      $scope.siaTesterData = data;
      console.log(data);
    });

  //create new tester
  $scope.createTester = function () {
    siaTester.createTester($scope.siaData)
      .success(function (data) {
        $scope.siaTesterData = data;
        $scope.siaData = {};
      });
  };
});

newTester.controller('ciseuCtrl', function ($scope, ciseuTester, User) {
  $scope.siaData = {};

  User.get()

  .success(function (data) {
    $scope.users = data;
  });

  ciseuTester.get()
    .success(function (data) {
      $scope.ciseuTesterData = data;
      console.log(data);
    });

  //create new tester
  $scope.createTester = function () {
    ciseuTester.createTester($scope.ciseuData)
      .success(function (data) {
        $scope.ciseuTesterData = data;
        $scope.ciseuData = {};
      });
  };
});
