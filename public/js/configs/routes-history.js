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
      templateUrl: '../list.html'
    })
    .when('/inwork', {
      controller: 'inWorkListCtrl',
      templateUrl: '../list.html'
    })
    .when('/outdated', {
      controller: 'outdatedListCtrl',
      templateUrl: '../list.html'
    })
    .when('/calendar', {
      templateUrl: '../calendar.html'
    })
    .when('/test', {
      controller: 'TesterCtrl',
      templateUrl: '../test.html'
    })
    .when('/newTest', {
      controller: 'newCycleCtrl',
      templateUrl: '../testDetail.html'
    })
    .when('/testList', {
      controller: 'testerListCtrl',
      templateUrl: '../testList.html'
    })
    .when('/notReviewed', {
      controller: 'notReviewedListCtrl',
      templateUrl: '../list.html'
    });

});