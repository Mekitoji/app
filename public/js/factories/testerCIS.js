angular.module('newTester')

.factory('cisTester', function ($http) {
  return {
    get: function () {
      return $http.get('/api/cis/testerStat/');
    },
    createTester: function (data) {
      return $http.post('/api/cis/testerStat/', data);
    },
    instertApp: function (id, data) {
      return $http.post('/api/cis/testerStat/app/' + id, data);
    },
    delete: function (id) {
      return $http.delete('/api/cis/testerStat/' + id);
    }
  };
});