angular.module('project')
//app api
.factory('Calendar', function ($http) {
  return {
    get: function () {
      return $http.get('/api/eu/calendar/');
    },
    getApproved: function () {
      return $http.get('/api/eu/calendar/approved');
    },
    getRejected: function () {
      return $http.get('/api/eu/calendar/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/eu/calendar/outdated');
    },
    update: function (id, calData) {
      return $http.put('/api/eu/calendar/' + id, calData);
    }
  };
});