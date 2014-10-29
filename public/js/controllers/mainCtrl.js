angular.module('project')

.controller('mainController', function ($scope, $http, Apps) {
  //get formData clear
  $scope.formData = {};
  //get  all apps and show them
  Apps.get()
    .success(function (data) {
      $scope.apps = data;
    });

  $scope.createApp = function () {
    Apps.create($scope.formData)
      .success(function (data) {
        $scope.apps = data;
        $scope.formData = {};
      });
  };

  $scope.deleteApp = function (id) {
    Apps.delete(id)
      .success(function (data) {
        $scope.apps = data; //get new list
      });
  };

  $scope.updateApp = function (id) {
    Apps.update(id, $scope.formData)
      .success(function (data) {
        $scope.apps = data;
      });
  };
});