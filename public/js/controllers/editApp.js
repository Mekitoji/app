angular.module('project')

.controller('EditCtrl', function ($scope, $routeParams, $location, $http, Apps) {

  $scope.edit = true;
  var projectUrl = $routeParams.appId;
  Apps.update(projectUrl, $scope.formData)
    .success(function (data) {
      $scope.formData = data;

    });

  $scope.deleteApp = function (id) {
    Apps.delete(id, $scope.formData)
      .success(function (data) {
        $scope.apps = data; //get new list
        $location.path('/');
      });
  };

  $scope.updateApp = function (id) {
    Apps.update(id, $scope.formData)
      .success(function (data) {
        $scope.apps = data;
        $location.path('/');
      });
  };

});