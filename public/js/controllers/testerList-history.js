angular.module('history-project')

.controller('testerListCtrl', function ($scope, $http, History) {
  var permission;
  var locationC = document.URL.split('/')[3];
  $scope.year = document.location.pathname.split('/')[2];

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
    console.log(a);
    console.log(b);
    if (a.app.appName.toLowerCase() < b.app.appName.toLowerCase()) return -1;
    if (a.app.appName.toLowerCase() > b.app.appName.toLowerCase()) return 1;
    return 0;
  }

  History.get()

  .success(function (testers) {
    $scope.testers = testers.sort(sortName);
    _.forEach($scope.testers, function (n, key) {
      console.log(n);
      n.appStorage = _.filter(n.appStorage, function(d){
        return d.year == $scope.year;
      });
      n.appStorage = n.appStorage.sort(sortAppStorage);
    });
  });
});