angular.module('project')

.controller('testerListCtrl', function ($scope, $http, Apps, iTester) {

  iTester.get()
    .success(function (testers) {
      $scope.testers = testers;
      console.log(testers);
    });

});