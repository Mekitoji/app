angular.module('project')
//app api
.factory('Calendar', function ($http) {
  return {
    get: function () {
      return $http.get('/api/global/calendar/');
    },
    getApproved: function () {
      return $http.get('/api/global/calendar/approved');
    },
    getRejected: function () {
      return $http.get('/api/global/calendar/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/global/calendar/outdated');
    },
    update: function (id, calData) {
      return $http.put('/api/global/calendar/' + id, calData);
    }
  };
});