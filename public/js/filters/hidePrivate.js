angular.module('project')

.filter('hidePrivate', function () {
  return function (id) {
    return id.split('/')[0];
  }
});