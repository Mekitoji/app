angular.module('main-tab', [])
  .config(function($routeProvider) {
    $routeProvider
      .when('/list', {
        templateUrl: 'list.html'
      })
      .when('calendar', {
        templateUrl: 'detail.html'
      })
      .when('test', {
        templateUrl: 'detail.html'
      });

  })