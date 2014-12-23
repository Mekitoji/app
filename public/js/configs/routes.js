angular.module('project')

//routes
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'ListCtrl',
      templateUrl: '../list.html'
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
    .when('/edit/:appId', {
      controller: 'EditCtrl',
      templateUrl: '../detail.html'
    })
    .when('/new', {
      controller: 'CreateCtrl',
      templateUrl: '../detail.html'
    })
    .when('/calendar', {
      templateUrl: '../calendar.html'
    })
    .when('/new_Test', {
      controller: 'NewTesterCtrl',
      templateUrl: '../test_detail.html'
    })
    .when('/test', {
      controller: 'TesterCtrl',
      templateUrl: '../test.html'
    });

});