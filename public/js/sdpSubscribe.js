angular.module('sdpSubscribe', [])

.factory('Subscribe', function ($http) {
  return {
    get: function() {
      return $http.get('/tools/subscribemember/all');
    },
    post: function(data) {
      return $http.post('/tools/subscribemember', data);
    }
  }
})

.factory('Members', function($http) {
    return {
      get: function() {
        return $http.get('/tools/sbcMember/getall');
      }
    };
})

.controller('subscribe', function($scope, Subscribe, Members) {
  $scope.data = {};
  $scope.subList = [];

  Subscribe.get()
  .success(function(data) {
    $scope.data = data;
    $scope.watching = data.filter(function(s) {
      return s.watch === true;
    });
    $scope.notWatching = data.filter(function(s) {
      return (s.watch === false) || (s.watch === undefined);
    });
  });

  Members.get()
  .success(function(data) {
    $scope.subscribers = data;
  });

  $scope.submit = function() {
    Subscribe.post({
    });
  }

  $scope.addSubscribe = function(data) {
    $scope.subList.push(data);
  }
  $scope.$watch('subList', function(c) {
    console.log("New array: " + c)
  }, true);

});
