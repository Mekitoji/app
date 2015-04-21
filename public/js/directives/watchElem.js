angular.module('project')

.directive('watchElem', ["Apps",

  function (Apps) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {

        element.on("change", function (event) {

          var current = scope.row.entity;
          if (element.val() === '0') {
            conf = confirm("Are you sure want to approve this app?");
            if (conf) {
              var projectUrl = current._id;

              Apps.update(projectUrl, current)

              .success(function (data) {
                scope.formData = data;
                scope.removeRow(event, current)
                element.blur();
              });
            } else {
              element.val(1);
            }
          } else if (element.val() === "2") {
            conf = confirm("Are you sure want to partially approve this app?")
            if (conf) {
              var projectUrl = current._id;

              Apps.update(projectUrl, current)

              .success(function (data) {
                scope.formData = data;
                scope.removeRow(event, current)
                element.blur();
              });
            } else {
              element.val(1);
            }
          }
        });
      }
    };
  }
]);