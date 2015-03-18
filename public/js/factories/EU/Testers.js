angular.module('project')

.factory('Tester', function ($http) {
  return {
    get: function () {
      return $http.get('/api/eu/tester');
    },
    // post: function() {
    //   return $http.post('/api/tester');
    // },
    update: function (id, testerData) {
      return $http.put('/api/eu/tester/' + id, testerData);
    },
  };
});