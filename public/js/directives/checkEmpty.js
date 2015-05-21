angular.module("project")

.directive("checkEmpty", function () {
  return {
    restrict: 'A',
    link: function (scope, elem) {
      elem.on("click", function (evt) {
        console.log(scope, scope.formData, elem);
        var current = scope.row.entity.resp;
        console.log(current);
        switch (current) {
        case "":
        case undefined:
        case null:
          alert("Please choose the responsible person for the App");
        default:
          console.log("ok");
        }
      });
    }
  }
});