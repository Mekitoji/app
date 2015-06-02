angular.module('history-project')

//routes
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'ListCtrl',
      templateUrl: '../../../list-history.html'
    })
    .when('/approved', {
      controller: 'approvedListCtrl',
      templateUrl: '../../../list-history.html'
    })
    .when('/inwork', {
      controller: 'inWorkListCtrl',
      templateUrl: '../../../list-history.html'
    })
    .when('/outdated', {
      controller: 'outdatedListCtrl',
      templateUrl: '../../../list-history.html'
    })
    .when('/notReviewed', {
      controller: 'notReviewedListCtrl',
      templateUrl: '../../../list-history.html'
    })
    .when('/calendar', {
    templateUrl: '../../../calendar-history.html'
    })
    .when('/testList', {
      controller: 'testerListCtrl',
      templateUrl: '../../../testList-history.html',
    });
});