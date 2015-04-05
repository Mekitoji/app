angular.module('history-project')

.controller('notReviewedListCtrl', function ($scope, $http, History) {

  $scope.loc = window.location.pathname.split('/')[3];
  var permission = false;
  $scope.perm = false;

  $scope.Options = {
    countryProp: {
      "type": "select",
      "name": "Country",
      "value": "COL_FIELD",
      "values": ["Russia", "Ukraine", "Belarus", "Latvia", "Kazakhstan", "Lithuania", "Estonia", "Uzbekistan", "Kyrgyzstan", "Tajikistan"]
    },
    categoryProp: {
      "type": "select",
      "name": "Category",
      "value": "COL_FIELD",
      "values": ["OTT", "Pay TV", "Broadcast", "OTT + Pay TV", "Game", "Others"]
    },
    sdpStatusProp: {
      "type": "select",
      "name": "Category",
      "value": "COL_FIELD",
      "values": ["Gate Keeper Review Request", "Gate Keeper Review", "Gate Keeper Review Reject", "Verification Request", "Pretest", "Function Testing", "Ad Testing", "Content Testing", "Final review", "App QA approved", "App QA rejected", "Delete", "Revise", "Save as draft", "Request for Deletion", "Item Review", "App Packaging Request", "Re-Verification Request"]
    },
    tvProp: {
      "type": "select",
      "name": "Tv",
      "value": "COL_FIELD",
      "values": ["Approved", "In Progress", "Partial", "Not Reviewed"]
    },
    respProp: {
      "type": "select",
      "name": "Resp",
      "value": "COL_FIELD",
    },
    currentStatusProp: {
      "type": "select",
      "name": "currentStatus",
      "value": "COL_FIELD",
      "values": ["Waiting for fix", "Waiting for review", "Waiting for QA", "Approved", "Not Reviewed"]
    },
    outdated: {
      "type": "select",
      "name": "outdated",
      "value": "COL_FIELD",
      "values": [true, false]
    },
    color: {
      "type": "select",
      "name": "color",
      "value": "COL_FIELD",
      "values": ['red', 'green', 'purple', 'orange']
    },
    calendar: {
      "type": "select",
      "name": "color",
      "value": "COL_FIELD",
      "values": ['H', 'D', 'L', 'LL'],
      "color": ['#B19CD9', 'green', 'orange', 'orange']
    },

  };

  //get list of apps
  History.getByDateNotReviewed($scope.loc)

  .success(function (data) {
    console.log(data);
    $scope.apps = data.apps;
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