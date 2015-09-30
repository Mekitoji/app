angular.module('project')

.filter('hidePrivate', function () {
  return function (id) {
    var result = id.split('/')[0].split('[')[1].split(']')[0];
    return result;
  };
});
