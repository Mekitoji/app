angular.module('newTester')

.factory('siaTester', function ($http) {
  return {
    get: function () {
      return $http.get('/api/sia/testerStat/');
    },
    createTester: function (data) {
      return $http.post('/api/sia/testerStat/', data);
    },
    instertApp: function (id, data) {
      return $http.post('/api/sia/testerStat/app/' + id, data);
    },
    delete: function (id) {
      return $http.delete('/api/sia/testerStat/' + id);
    }
  };
});