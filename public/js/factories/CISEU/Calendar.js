angular.module('project')
//app api
.factory('Calendar', function ($http) {
  return {
    get: function () {
      return $http.get('/api/ciseu/calendar/');
    },
    getApproved: function () {
      return $http.get('/api/ciseu/calendar/approved');
    },
    getRejected: function () {
      return $http.get('/api/ciseu/calendar/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/ciseu/calendar/outdated');
    },
    update: function (id, calData) {
      return $http.put('/api/ciseu/calendar/' + id, calData);
    }
  };
});
