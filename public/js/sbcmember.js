angular.module('sbcmember', [])

.factory('Members', function($http) {
    return {
      get: function() {
        return $http.get('/tools/sbcMember/getall');
      },
      post: function(data) {
        return $http.post('/tools/sbcMember', data);
      }
    }
})

.controller('members', function($scope, Members) {
  $scope.data = {};

  Members.get()
  .success(function(data) {
    $scope.data = data;
  });

  $scope.submit = function() {
    Members.post({
      mail: $scope.newMail,
      name: $scope.newName
    })
    .success(function() {

      $scope.data.push({
        mail: $scope.newMail,
        name: $scope.newName
      })

      $scope.newMail = null;
      $scope.newName = null;
      $('.modal').modal('hide');
    });
  };
})
