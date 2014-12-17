angular.module('project')
//app api
.factory('Calendar', function ($http) {
  return {
    get: function () {
      return $http.get('/api/cis/calendar/');
    },
    getApproved: function () {
      return $http.get('/api/cis/calendar/approved');
    },
    getRejected: function () {
      return $http.get('/api/cis/calendar/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/cis/calendar/outdated');
    },
    update: function (id, calData) {
      return $http.put('/api/cis/calendar/' + id, calData);
    }
  };
});