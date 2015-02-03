angular.module('project')

.controller('testerListCtrl', function ($scope, $http, Apps, iTester) {

var permission;
  var locationC = document.URL.split('/')[3];
  // take permission right from server
  if (locationC === 'cis') {
    if (userG === 'gkCIS' || userG === 'root') {
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


  iTester.get()
    .success(function (testers) {
      $scope.testers = testers;
      console.log(testers);
    });

});