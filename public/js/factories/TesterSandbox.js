angular.module('project')

.factory('iTester', function ($http) {
  return {
    get: function () {
      return $http.get('/api/global/testerStat');
    },
    // post: function() {
    //   return $http.post('/api/tester');
    // },
    update: function (id, testerData) {
      return $http.put('/api/global/testerStat/insertCycle/' + id, testerData);
    },
  };
});