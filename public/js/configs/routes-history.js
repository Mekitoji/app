angular.module('history-project')

//routes
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'ListCtrl',
      templateUrl: '../../../list.html'
    })
    .when('/approved', {
      controller: 'approvedListCtrl',
      templateUrl: '../../../list.html'
    })
    .when('/inwork', {
      controller: 'inWorkListCtrl',
      templateUrl: '../../../list.html'
    })
    .when('/outdated', {
      controller: 'outdatedListCtrl',
      templateUrl: '../../../list.html'
    })
    .when('/notReviewed', {
      controller: 'notReviewedListCtrl',
      templateUrl: '../../../list.html'
    })
    .when('/calendar', {
    templateUrl: '../../../calendar-history.html'
    })
    .when('/testList', {
      controller: 'testerListCtrl',
      template: '../../../testList-history.html',
    });
});