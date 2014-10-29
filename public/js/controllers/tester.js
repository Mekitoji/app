angular.module('project')


.controller('TesterCtrl', function ($scope, $http, Apps, Tester) {
  //get our app list
  var permission;
  // take permission right from server
  if (userG === 'gk' || userG === 'root') {
    permission = true;
    $scope.perm = true;
  } else {
    permission = false;
    $scope.perm = false;
  }


  Apps.get()
    .success(function (data) {
      $scope.apps = data;
    });

  //get our calendar list
  Tester.get()
    .success(function (data) {
      $scope.testerDatas = data;
    });


});