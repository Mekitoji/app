angular.module('appController', [])

// inject the Apps service factory into our controller
.controller('mainController', function($scope, $http, Apps) {
  $scope.formData = {};

  // GET =====================================================================
  // when landing on the page, get all todos and show them
  // use the service to get all the todos
  Apps.get()
    .success(function(data) {
      $scope.app = data;
    });

  // CREATE ==================================================================
  // when submitting the add form, send the text to the node API
  $scope.createApp = function() {

    // validate the formData to make sure that something is there
    // if form is empty, nothing will happen
    if ($scope.formData.text != undefined) {

      // call the create function from our service (returns a promise object)
      Apps.create($scope.formData)

      // if successful creation, call our get function to get all the new todos
      .success(function(data) {
        $scope.formData = {}; // clear the form so our user is ready to enter another
        $scope.app = data; // assign our new list of todos
      });
    }
  };

  $scope.updateApp = function() {
    if ($scope.formData.text != undefined) {

      Apps.update($scope.formData)

      // if successful updated, call our get function to get all the new todos
      .success(function(data) {
        $scope.formData = {}; // clear the form so our user is ready to enter another
        $scope.app = data; // assign our new list of data
      });
    }
  };

  // DELETE ==================================================================
  // delete a todo after checking it
  $scope.deleteTodo = function(id) {
    Apps.delete(id)
    // if successful creation, call our get function to get all the new todos
    .success(function(data) {
      $scope.app = data; // assign our new list of todos
    });
  };
});