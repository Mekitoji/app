angular.module('project')
//app api
.factory('Calendar', function ($http) {
  return {
    get: function () {
      return $http.get('/api/sia/calendar/');
    },
    getApproved: function () {
      return $http.get('/api/sia/calendar/approved');
    },
    getRejected: function () {
      return $http.get('/api/sia/calendar/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/sia/calendar/outdated');
    },
    update: function (id, calData) {
      return $http.put('/api/sia/calendar/' + id, calData);
    }
  };
});