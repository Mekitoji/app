angular.module('project')

.factory('Apps', function ($http) {
  return {
    get: function () {
      return $http.get('/api/eu/gk/');
    },
    getApproved: function () {
      return $http.get('/api/eu/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/eu/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/eu/gk/outdated');
    },
    create: function (appData) {
      return $http.post('/api/eu/gk', appData);
    },
    update: function (id, appData) {
      return $http.put('/api/eu/gk/' + id, appData);
    },
    delete: function (id) {
      return $http.delete('api/eu/gk/' + id);
    }
  };
});