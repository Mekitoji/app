angular.module('history-project')

.controller('outdatedListCtrl', function ($scope, $http, History) {

  $scope.loc = window.location.pathname.split('/')[3];
  var permission = false;
  $scope.perm = false;

  $scope.loading = true;
  $scope.dataLoad = false;
  //get list of apps
  History.getByDateOutdated($scope.loc)

  .success(function (data) {
    // console.log(data);
    if (data.apps === undefined) {
      var list = document.getElementById('app-list');
      var container = document.getElementsByClassName("container")[0];
      var notice = document.createElement("div");
      // datepicker.style.position = "absolute";
      notice.id = "notice-error";
      notice.innerHTML = "No data for this date. Please try another.";
      list.parentNode.removeChild(list);
      container.appendChild(notice);

    } else {
      $scope.apps = data.apps;
    }
  })
  .finally(function() {
    $scope.loading = false;
    $scope.dataLoad = true;
  });

  $scope.getRowIndex = function () {
    var index = this.row.rowIndex;
    return index + 1;
  };

  $scope.currenDate = Date.now();

  //ng-grid setting
  $scope.gridOptions = {
    data: 'apps',
    columnDefs: [{
      displayName: 'No',
      cellTemplate: '<div ><div >{{getRowIndex()}}</div></div>',
      width: 30
    }, {
      field: 'applicationId',
      displayName: 'Application Id',
      enableCellEdit: false
    }, {
      field: 'country',
      displayName: 'Country',
      enableCellEdit: false,
      width: 70
    }, {
      field: 'appName',
      displayName: 'Application name',
      enableCellEdit: false,
    }, {
      field: 'category',
      displayName: 'Category',
      enableCellEdit: false,
      width: 100
    }, {
      field: 'sdpStatus',
      displayName: 'SDP Status',
      enableCellEdit: false,
    }, {
      field: 'updateTime',
      displayName: 'Update date',
      //604800000 ms = 7day
      cellTemplate: '<div ng-class="{pink: currenDate-dateParse(row.getProperty(col.field))>604800000}"><div class="ngCellText">{{row.getProperty(col.field)|date:\'YYYY-MM-DD\'-1}}</div></div>',
      enableCellEdit: false,
      cellFilter: 'date:\'MM/dd/yyyy\'',
      width: 100
    }, {
      field: 'seller',
      displayName: 'Seller',
      enableCellEdit: false
    }, {
      field: 'tv',
      displayName: 'TV',
      enableCellEdit: false,
      width: 80
    }, {
      field: 'currentStatus',
      displayName: 'Current status',
      cellTemplate: '<div class={{row.entity.color}} ><div ng-class="{\'purple\': row.entity.currentStatus == \'Waiting for QA\',\'orange\': row.entity.currentStatus== \'Waiting for review\',\'grey\': row.entity.currentStatus== \'Not Reviewed\',\'green\':row.entity.currentStatus==\'Waiting for fix\'}" style="color:black" class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
      enableCellEdit: false,
      width: 125
    }, {
      field: 'color',
      displayName: '#',
      enableCellEdit: false,
      cellTemplate: '<div class={{row.entity.color}} "><div  class="ngCellText"></div></div>',
      width: '20px',
    }, {
      field: 'testCycles',
      displayName: 'Test Cycles',
      enableCellEdit: false,
      width: 90
    }, {
      field: 'replyTime.toFixed(2)',
      displayName: 'Review Time',
      enableCellEdit: false,
      width: 85
    }, {
      field: 'resp',
      displayName: 'Resp',
      cellTemplate: '<div ng-class="{\'green\': row.entity.resp == \'VE\',\'red\': row.entity.resp == \'AS\',\'yellow\': row.entity.resp == \'YK\',\'blue\': row.entity.resp == \'DP\' }" " ><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
      enableCellEdit: false,
      width: 50
    }, {
      field: 'outdated',
      displayName: 'Outdated',
      enableCellEdit: false,
      width: 75
    }, {
      field: '_id',
      visible: false,
    }],
    showGroupPanel: true,
    enableColumnResize: true,
    showFilter: true,
    enableRowSelection: false,
    showFooter: true,
    sortInfo: {
      fields: ['appName'],
      directions: ['asc']
    },
    filterOptions: {
      filterText: "",
      useExternalFilter: false
    },
  };
});