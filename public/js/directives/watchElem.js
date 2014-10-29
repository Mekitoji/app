angular.module('project')

.directive('watchElem', [

  function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {


        scope.$watch(function () {
          return element.val();
        }, function (newValue) {
          console.log(element.val());
          console.log(newValue);
          var conf;
          if (newValue === '0') {
            conf = confirm('Are you sure you want to approve the App?');
            if (conf) {
              $('#clickHere').trigger('focus');
              location.reload();
            } else {
              element.val(1);
              newValue = 1;
              location.reload();
            }
          }

          if (newValue === '2') {
            conf = confirm('Are you sure you want to partially approve the App?');
            if (conf) {
              $('#clickHere').trigger('focus');
              location.reload();
            } else {
              element.val(1);
              newValue = 1;
              location.reload();
            }
          }

        });
      }
    };
  }
]);