angular.module('project')

.factory('iTester', function ($http) {
  return {
    get: function () {
      return $http.get('/api/eu/testerStat');
    },
    // post: function() {
    //   return $http.post('/api/tester');
    // },
    update: function (id, testerData) {
      return $http.put('/api/eu/testerStat/insertCycle/' + id, testerData);
    },
  };
});