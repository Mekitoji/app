angular.module('rate', [])

.factory('Rate', function($http) {
  return {
    get: function() {
      return $http.get('/api/rate');
    },
    getRegion: function(region) {
      return $http.get('/api/rate/' + region);
    }
  };
})

.controller('rateSettings', function($scope, Rate) {

  $scope.data = {};
  Rate.get()
    .success(function(data) {
      $scope.data = data;
      console.log(data);
    });
})

.directive('rateChart', function($parse) {
  var directiveDefinitionObject = {
    restrict: 'E',
    replace: false,
    scope:{data:'=chartData'},
    link: function(scope, element, attrs) {
      //do magic here
    }
  }
  return directiveDefinitionObject;
});