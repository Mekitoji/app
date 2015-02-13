angular.module('project')

.directive('autoComplete', function ($timeout) {
  return function ($scope, elem) {
    elem.autocomplete({
      source: ["Waiting for fix", "Waiting for review", "Waiting for QA", "Waiting for answer", "Waiting for check", "Approved", "Not Reviewed"],
      select: function () {
        $timeout(function () {
          elem.trigger('input');
        }, 0);
      }
    });
  };
});