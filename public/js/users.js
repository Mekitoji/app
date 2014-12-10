angular.module('usersList', [])

.factory('users', function ($http) {
  return {
    get: function () {
      return $http.get('/api/users');
    },
    update: function (id, data) {
      return $http.get('/api/users/' + id, data);
    }
  };
})

.controller('list', function ($scope, $http, users) {
  users.get()
    .success(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].local.group == 'root') {
          delete data[i];
        }
      }
      $scope.users = data;
    });
});