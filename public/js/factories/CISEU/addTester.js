angular.module('newTester')

.factory('ciseuTester', function ($http) {
  return {
    get: function () {
      return $http.get('/api/ciseu/testerStat/');
    },
    createTester: function (data) {
      return $http.post('/api/ciseu/testerStat/', data);
    },
    instertApp: function (id, data) {
      return $http.post('/api/ciseu/testerStat/app/' + id, data);
    },
    delete: function (id) {
      return $http.delete('/api/ciseu/testerStat/' + id);
    }
  };
});
