angular.module('project')
//app api
.factory('Apps', function ($http) {
  return {
    get: function () {
      return $http.get('/api/gk/');
    },
    getApproved: function () {
      return $http.get('/api/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/gk/outdated');
    },
    create: function (appData) {
      return $http.post('/api/gk', appData);
    },
    update: function (id, appData) {
      return $http.put('/api/gk/' + id, appData);
    },
    delete: function (id) {
      return $http.delete('api/gk/' + id);
    }
  };
});