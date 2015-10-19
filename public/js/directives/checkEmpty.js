angular.module("project")

.directive("checkEmpty", function () {
  return {
    restrict: 'A',
    link: function (scope, elem) {
      elem.on("click", function (evt) {
        console.log(scope, scope.formData, elem);
        var resp = scope.row.entity.resp;
        var color = scope.row.entity.color;

        if(resp === '' ||
          resp === undefined ||
          resp === null) {
            alert('Please choose the responsible person for the App');
        } else if(color === undefined ||
                  color === null ||
                  color === '') {
          alert('Calendar value cannot be changed for app with empty status(color should be choosed too)');
        } else {
          return void 0;
        }

      });
    }
  };
});
