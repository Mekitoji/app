angular.module('history-project')

.controller('testerListCtrl', function ($scope, $http, History) {
  var permission;
  var locationC = document.URL.split('/')[3];
  $scope.year = document.location.pathname.split('/')[2];
  $scope.loc = window.location.pathname.split('/')[3];

  function sortName(a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  }

  function sortAppStorage(a, b) {
    if (a.app.appName.toLowerCase() < b.app.appName.toLowerCase()) return -1;
    if (a.app.appName.toLowerCase() > b.app.appName.toLowerCase()) return 1;
    return 0;
  }

  $scope.loading = true;
  $scope.dataLoad = false;

  History.getByDate($scope.loc)

  .success(function (data) {
    $scope.testers = data.testerStat;
    if (data.apps === undefined) {
      var container = document.getElementsByClassName("container")[0];
      var notice = document.createElement("div");
      notice.id = "notice-error";
      notice.innerHTML = "No data for this date. Please try another.";
      container.appendChild(notice);
    } else {
      $scope.testers = $scope.testers.sort(sortName);
      _.forEach($scope.testers, function (n, key) {
        n.appStorage = n.appStorage.sort(sortAppStorage);
      });
    }
  })
  .finally(function() {
    $scope.loading = false;
    $scope.dataLoad = true;
  });
});