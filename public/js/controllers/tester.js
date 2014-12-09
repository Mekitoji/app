angular.module('project')


.controller('TesterCtrl', function ($scope, $http, Apps, Tester) {
  //get our app list
  var permission;
  var locationC = document.URL.split('/')[3];
  // take permission right from server
  if (locationC === 'cis') {
    if (userG === 'gk' || userG === 'root') {
      permission = true;
      $scope.perm = true;
    } else {
      permission = false;
      $scope.perm = false;
    }
  } else if (locationC === 'eu') {
    if (userG === 'gkEU' || userG === 'root') {
      permission = true;
      $scope.perm = true;
    } else {
      permission = false;
      $scope.perm = false;
    }
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