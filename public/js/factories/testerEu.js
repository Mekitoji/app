angular.module('newTester', [])

.factory('euTester', function ($http) {
  return {
    get: function () {
      return $http.get('/api/eu/testerStat/');
    },
    createTester: function (data) {
      return $http.post('/api/eu/testerStat/Tester/', data);
    },
    instertApp: function (id, data) {
      return $http.post('/api/eu/testerStat/app/' + id, data);
    },
    delete: function (id) {
      return $http.delete('/api/eu/testerStat/' + id);
    }
  };
});