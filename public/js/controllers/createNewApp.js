angular.module('project')

.controller('CreateCtrl', function ($scope, $http, Apps) {
  var permission;
  // take permission right from server
  if (userG === 'gk' || userG === 'root') {
    permission = true;
    $scope.perm = true;
  } else {
    permission = false;
    $scope.perm = false;
  }

  $scope.formData = {};
  $scope.createApp = function () {
    Apps.create($scope.formData)

    .success(function (data) {
      $scope.apps = data;
      $scope.formData = {};
    });
  };
});