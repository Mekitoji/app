angular.module('project')

.directive('watchElem', ["Apps",

  function (Apps) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {

        element.on("change", function (event) {

          var current = scope.row.entity;
          var projectUrl = current._id;
          if (element.val() === '0') {
            conf = confirm("Are you sure want to approve this app?");
            if (conf) {

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

              Apps.update(projectUrl, current)

              .success(function (data) {
                scope.formData = data;
                scope.removeRow(event, current)
                element.blur();
              });
            } else {
              element.val(1);
            }
          } else if (element.val() === "1" || element.val() === "3"){
            Apps.update(projectUrl, current)
            .success(function(data) {
              scope.formData = data;
            });
          }
        });
      }
    };
  }
]);