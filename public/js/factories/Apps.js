angular.module('project')
//app api
.factory('Apps', function ($http) {
  return {
    get: function () {
      return $http.get('/api/cis/gk/');
    },
    getApproved: function () {
      return $http.get('/api/cis/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/cis/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/cis/gk/outdated');
    },
    getNotReviewed: function () {
      return $http.get('/api/cis/gk/notReviewed');
    },
    create: function (appData) {
      return $http.post('/api/cis/gk', appData);
    },
    update: function (id, appData) {
      return $http.put('/api/cis/gk/' + id, appData);
    },
    delete: function (id) {
      return $http.delete('/api/cis/gk/' + id);
    }
  };
});