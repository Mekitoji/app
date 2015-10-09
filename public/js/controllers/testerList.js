angular.module('project')

.controller('testerListCtrl', function ($scope, $http, Apps, iTester) {

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

  $scope.loading = true;
  $scope.dataLoad = false;

  $scope.filter ={};
  $scope.filter.year = $scope.year;

  function sortName(a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  }

  function sortAppStorage(a, b) {
    if (a.app.appName.toLowerCase() < b.app.appName.toLowerCase()) return -1;
    if (a.app.appName.toLowerCase() > b.app.appName.toLowerCase()) return 1;
    return 0;
  }

  iTester.get()

  .success(function (testers) {
    $scope.testers = testers.sort(sortName);
    _.forEach($scope.testers, function (n, key) {
      console.log(n);
      n.appStorage = _.filter(n.appStorage, function(d){
        return d.year == $scope.year;
      });
      _.forEach(n.appStorage, function(v) {
        v.testCycleStorage = _.filter(v.testCycleStorage, function(d) {
          var tmpYear = new Date(d.date).getFullYear();
          if(tmpYear == $scope.year)
            return true;
          else
            return false;
        });
      });
      n.appStorage = n.appStorage.sort(sortAppStorage);
    });
  })
  .finally(function() {
    $scope.loading = false;
    $scope.dataLoad = true;
  });
});
