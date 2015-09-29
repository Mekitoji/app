angular.module('project')

.factory('iTester', function ($http) {
  return {
    get: function () {
      return $http.get('/api/cis/testerStat');
    },
    update: function (id, testerData) {
      return $http.put('/api/cis/testerStat/insertCycle/' + id, testerData);
    }
  };
});
