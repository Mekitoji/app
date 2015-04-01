angular.module('history-project')
//app api
.factory('History', function ($http) {
  return {
    get: function () {
      return $http.get('/api/cis/history/');
    }
  };
});