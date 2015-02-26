angular.module('project')

.factory('Apps', function ($http) {
  return {
    get: function () {
      return $http.get('/api/global/gk/');
    },
    getApproved: function () {
      return $http.get('/api/global/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/global/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/global/gk/outdated');
    },
    getNotReviewed: function () {
      return $http.get('/api/global/gk/notReviewed');
    },
    create: function (appData) {
      return $http.post('/api/global/gk', appData);
    },
    update: function (id, appData) {
      return $http.put('/api/global/gk/' + id, appData);
    },
    delete: function (id) {
      return $http.delete('api/global/gk/' + id);
    }
  };
});