angular.module('appService', [])

// super simple service
// each function returns a promise object 
.factory('Apps', function($http) {
  return {
    get: function() {
      return $http.get('/api/gk');
    },
    create: function(appData) {
      return $http.post('/api/gk', appData);
    },
    update: function(appData, id) {
      return $http.put('/api/gk/' + id, appData);
    },
    delete: function(id) {
      return $http.delete('/api/gk/' + id);
    }
  }
});