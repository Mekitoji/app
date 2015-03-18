angular.module('project')

.factory('Apps', function ($http) {
  return {
    get: function () {
      return $http.get('/api/sia/gk/');
    },
    getApproved: function () {
      return $http.get('/api/sia/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/sia/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/sia/gk/outdated');
    },
    getNotReviewed: function () {
      return $http.get('/api/sia/gk/notReviewed');
    },
    create: function (appData) {
      return $http.post('/api/sia/gk', appData);
    },
    update: function (id, appData) {
      return $http.put('/api/sia/gk/' + id, appData);
    },
    delete: function (id) {
      return $http.delete('/api/sia/gk/' + id);
    }
  };
});