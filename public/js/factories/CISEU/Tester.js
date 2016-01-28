angular.module('project')

.factory('iTester', function ($http) {
  return {
    get: function () {
      return $http.get('/api/ciseu/testerStat');
    },
    update: function (id, testerData) {
      return $http.put('/api/ciseu/testerStat/insertCycle/' + id, testerData);
    },
    secondUpdate: function(id, testerData) {
      return $http.put('/api/ciseu/testerStat/insertSecondCycle/' + id, testerData);
    }
  };
});
