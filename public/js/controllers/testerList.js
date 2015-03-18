angular.module('project')

.controller('testerListCtrl', function ($scope, $http, Apps, iTester) {

  var permission;
  var locationC = document.URL.split('/')[3];
  // take permission right from server
  if (locationC === 'cis') {
    if (userG === 'gkCIS' || userG === 'root') {
      permission = true;
      $scope.perm = true;
    } else {
      permission = false;
      $scope.perm = false;
    }
  } else if (locationC === 'eu') {
    if (userG === 'gkEU' || userG === 'root') {
      permission = true;
      $scope.perm = true;
    } else {
      permission = false;
      $scope.perm = false;
    }
  } else if (locationC === 'global') {
    if (userG === 'global' || userG === 'root') {
      permission = true;
      $scope.perm = true;
    } else {
      permission = false;
      $scope.perm = false;
    }
  } else if (locationC === 'sia') {
    if (userG === 'gkSIA' || userG === 'root') {
      permission = true;
      $scope.perm = true;
    } else {
      permission = false;
      $scope.perm = false;
    }
  }

  function sortName(a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  }

  function sortAppStorage(a, b) {
    return a.app.appName.toLowerCase().localeCompare(b.app.appName.toLowerCase());
  }

  iTester.get()

  .success(function (testers) {
    $scope.testers = testers.sort(sortName);
    _.forEach($scope.testers, function (n, key) {
      console.log(n);
      n.appStorage = n.appStorage.sort(sortAppStorage);
    });
  });
});