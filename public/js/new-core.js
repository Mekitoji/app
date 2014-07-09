angular.module('project', ['ngRoute'])
//restful 
.factory('Apps', function($http) {
  return {
    get: function() {
      return $http.get('/api/gk');
    },
    create: function(appData) {
      return $http.post('/api/gk', appData);
    },
    update: function(id, appData) {
      return $http.put('/api/gk/' + id, appData);
    },
    delete: function(id) {
      return $http.delete('api/gk' + id);
    }
  }
})

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'ListCtrl',
      templateUrl: 'list.html'
    })
    .when('/edit/:appId', {
      controller: 'EditCtrl',
      templateUrl: 'detail.html'
    })
    .when('/new', {
      controller: 'CreateCtrl',
      templateUrl: 'detail.html'
    });

})

.controller('ListCtrl', function($scope, $http, Apps) {
  Apps.get()

  .success(function(data) {
    $scope.apps = data;
  });
})

.controller('CreateCtrl', function($scope, $http, Apps) {
  $scope.formData = {};
  $scope.createApp = function() {
    Apps.create($scope.formData)

    .success(function(data) {
      $scope.apps = data;
      $scope.formData = {};
    });
  };
})

.controller('EditCtrl', function($scope, $routeParams, $location, $http, Apps) {

  var projectUrl = $routeParams.appId;
  Apps.update(projectUrl, $scope.formData)
    .success(function(data) {
      $scope.formData = data;

    })

  $scope.deleteApp = function(id) {
    Apps.delete(id)
      .success(function(data) {
        $scope.apps = data; //get new list
        $location.path('/');
      });
  };

  $scope.updateApp = function(id) {
    Apps.update(id, $scope.formData)
      .success(function(data) {
        $scope.apps = data;
        $location.path('/');
      });
  };

})

.controller('mainController', function($scope, $http, Apps) {
  //get formData clear
  $scope.formData = {};
  //get  all apps and show them
  Apps.get()
    .success(function(data) {
      $scope.apps = data;
    });

  $scope.createApp = function() {
    Apps.create($scope.formData)
      .success(function(data) {
        $scope.apps = data;
        $scope.formData = {};
      });
  };

  $scope.deleteApp = function(id) {
    Apps.delete(id)
      .success(function(data) {
        $scope.apps = data; //get new list
      });
  };

  $scope.updateApp = function(id) {
    Apps.update(id, $scope.formData)
      .success(function(data) {
        $scope.apps = data;
      });
  };

});