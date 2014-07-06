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
        .when('/edit/:projectId', {
            controller: 'EditCtrl',
            templateUrl: 'detail.html'
        })
        .when('/new', {
            controller: 'CreateCtrl',
            templateUrl: 'detail.html'
        })
        .otherwise({
            redirectTo: '/'
        });
})

.controller('ListCtrl', function($scope, Apps) {
    $scope.projects = Apps;
})

.controller('CreateCtrl', function($scope, $location, $timeout, Projects) {
    $scope.save = function() {
        Projects.$add($scope.project, function() {
            $timeout(function() {
                $location.path('/');
            });
        });
    };
})

.controller('EditCtrl', function($scope, $location, $routeParams, $firebase, fbURL) {
    var projectUrl = fbURL + $routeParams.projectId;
    $scope.project = $firebase(new Firebase(projectUrl));

    $scope.destroy = function() {
        $scope.project.$remove();
        $location.path('/');
    };

    $scope.save = function() {
        $scope.project.$save();
        $location.path('/');
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