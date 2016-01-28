angular.module('project')

.factory('Tester', function ($http) {
  return {
    get: function () {
      return $http.get('/api/ciseu/tester');
    },
    update: function (id, testerData) {
      return $http.put('/api/ciseu/tester/' + id, testerData);
    },
  };
});
