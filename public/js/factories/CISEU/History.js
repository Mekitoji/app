angular.module('history-project')
//app api
.factory('History', function ($http) {
  return {
    get: function () {
      return $http.get('/api/ciseu/history/');
    },
    getByDate: function (date) {
      //date format: mm-dd-yyyy or mm-dd-yy (03-31-2015)
      return $http.get('/api/ciseu/history/' + date);
    },
    getByDateOutdated: function (date) {
      //date format: mm-dd-yyyy or mm-dd-yy (03-31-2015)
      return $http.get('/api/ciseu/history/' + date + "/outdated");
    },
    getByDateNotReviewed: function (date) {
      //date format: mm-dd-yyyy or mm-dd-yy (03-31-2015)
      return $http.get('/api/ciseu/history/' + date + "/notReviewed");
    },
    getByDateRejected: function (date) {
      //date format: mm-dd-yyyy or mm-dd-yy (03-31-2015)
      return $http.get('/api/ciseu/history/' + date + "/rejected");
    }
  };
});
