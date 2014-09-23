/**
 * postmail Module
 *
 * Post mail to Korea
 */
angular.module('postmail', [])

.factory('mail', function ($http) {
  return {
    post: function () {
      return $http.post('/postmail', data);
    }
  };
})

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
  };
})

.controller('post', function ($scope, $http, mail) {

});