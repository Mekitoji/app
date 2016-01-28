angular.module('project')
//app api
.factory('Apps', function ($http) {
  return {
    get: function () {
      return $http.get('/api/ciseu/gk/');
    },
    getApproved: function () {
      return $http.get('/api/ciseu/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/ciseu/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/ciseu/gk/outdated');
    },
    getNotReviewed: function () {
      return $http.get('/api/ciseu/gk/notReviewed');
    },
    create: function (appData) {
      return $http.post('/api/ciseu/gk', appData);
    },
    update: function (id, appData) {
      return $http.put('/api/ciseu/gk/' + id, appData);
    },
    delete: function (id) {
      return $http.delete('/api/ciseu/gk/' + id);
    }
  };
});
