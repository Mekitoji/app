angular.module('newTester')

.factory('sandboxTester', function ($http) {
  return {
    get: function () {
      return $http.get('/api/global/testerStat/');
    },
    createTester: function (data) {
      return $http.post('/api/global/testerStat/', data);
    },
    instertApp: function (id, data) {
      return $http.post('/api/global/testerStat/app/' + id, data);
    },
    delete: function (id) {
      return $http.delete('/api/global/testerStat/' + id);
    }
  };
});