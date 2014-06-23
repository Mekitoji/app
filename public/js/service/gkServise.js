angular.module('gkService', [])

// super simple service
// each function returns a promise object 
.factory('Apps', function($http) {
  return {
    get: function() {
      return $http.get('/api/gk');
    },
    create: function(todoData) {
      return $http.post('/api/gk', todoData);
    },
    delete: function(id) {
      return $http.delete('/api/gk/' + id);
    }
  }
});