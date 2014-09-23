/**
 * postmail Module
 *
 * Post mail to Korea
 */
angular.module('postmail', [])
  .factory('mail', function ($http) {
    return {
      get: function () {
        return $http.get();
      }
    };
  })
  .controller();