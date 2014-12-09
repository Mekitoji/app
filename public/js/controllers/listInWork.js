angular.module('project')

.controller('inWorkListCtrl', function ($scope, $http, Apps, Tester) {
  $scope.loc = 'In work';
  var permission;
  // take permission right from server
  if (userG === 'gk' || userG === 'root') {
    permission = true;
    $scope.perm = true;
  } else {
    permission = false;
    $scope.perm = false;
  }
  Tester.get()

  .success(function (data) {});
    $scope.tester = [];
    $scope.testersArr = data;
    $scope.testersArr.forEach(function (item, i) {
      $scope.tester.push(item.tester);

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
          "values": ["Gk review request", "GK review", "GK Review Reject", "Verification Request", "Pre-test", "Function Testing", "Content Testing", "Final review", "App QA Approved", "App QA Rejected"]
        },
        tvProp: {
          "type": "select",
          "name": "TV",
          "value": "COL_FIELD",
          "values": ["Approved", "Reject", "Partial"]
        },
        respProp: {
          "type": "select",
          "name": "Resp",
          "value": "COL_FIELD",
          "values": ["AS", "DP", "VE", "YK"]
        },
        currentStatusProp: {
          "type": "select",
          "name": "currentStatus",
          "value": "COL_FIELD",
          "values": ["Waiting for fix", "Waiting for review", "Waiting for QA"]
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
      };
    });


  $scope.cellSelectEditableTemplateCountry = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.countryProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateCategory = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.categoryProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateSdpStatus = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.sdpStatusProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateTv = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.tvProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateResp = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.respProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateCurrentStatus = '<input auto-complete ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" type="text" />';
  $scope.cellSelectEditableTemplateColor = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.color.values" />';
  $scope.cellSelectEditableTemplateOutdated = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.outdated.values" />';
  $scope.cellSelectEditableTemplateUpdateTime = '<input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD"  type="date" />';

  $scope.edit = false;

  Apps.getRejected()

  .success(function (data) {
    $scope.apps = data;
  });

  $scope.getRowIndex = function () {
    var index = this.row.rowIndex;
    // $scope.gridOptions.selectItem(index, false);
    return index + 1;
  };

  $scope.$on('ngGridEventEndCellEdit', function (evt) {
    var currentObj = evt.targetScope.row.entity;
    console.log(currentObj); //debug
    // the underlying data bound to the row
    // Detect changes and send entity to server
    console.log(currentObj._id); //debug

    //update database value
    var projectUrl = currentObj._id;
    Apps.update(projectUrl, currentObj)
      .success(function (data) {
        $scope.formData = data;
      });
  });

  $scope.dateParse = function (data) {
    return Date.parse(data);
  };

  $scope.currenDate = Date.now();


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
        enableCellEdit: permission,
        editableCellTemplate: $scope.cellSelectEditableTemplateCountry,
        width: 70
      }, {
        field: 'appName',
        displayName: 'Application name',
        enableCellEdit: permission,
      }, {
        field: 'category',
        displayName: 'Category',
        enableCellEdit: permission,
        editableCellTemplate: $scope.cellSelectEditableTemplateCategory,
        width: 100
      }, {
        field: 'sdpStatus',
        displayName: 'SDP Status',
        enableCellEdit: permission,
        editableCellTemplate: $scope.cellSelectEditableTemplateSdpStatus
      }, {
        field: 'updateTime',
        displayName: 'Update date',
        //604800000 ms = 7day
        cellTemplate: '<div ng-class="{pink: currenDate-dateParse(row.getProperty(col.field))>604800000}"><div class="ngCellText">{{row.getProperty(col.field)|date:\'YYYY-MM-DD\'-1}}</div></div>',
        enableCellEdit: permission,
        editableCellTemplate: $scope.cellSelectEditableTemplateUpdateTime,
        width: 100
      }, {
        field: 'seller',
        displayName: 'Seller',
        enableCellEdit: permission
      }, {
        field: 'tv',
        displayName: 'TV',
        enableCellEdit: permission,
        editableCellTemplate: $scope.cellSelectEditableTemplateTv,
        width: 80
      }, {
        field: 'currentStatus',
        displayName: 'Current status',
        cellTemplate: '<div class={{row.entity.color}} " ><div ng-class="{\'purple\': row.entity.currentStatus == \'Waiting for QA\',\'orange\':row.entity.currentStatus==\'Waiting for review\'}",\'green\':row.entity.currentStatus==\'Waiting for fix\'}" style="color:black" class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
        enableCellEdit: permission,
        editableCellTemplate: $scope.cellSelectEditableTemplateCurrentStatus,
        width: 125
      }, {
        field: 'color',
        displayName: '#',
        enableCellEdit: permission,
        cellTemplate: '<div class={{row.entity.color}} "><div  class="ngCellText"></div></div>',
        editableCellTemplate: $scope.cellSelectEditableTemplateColor,
        width: '20px',
      }, {
        field: 'testCycles',
        displayName: 'Test Cycles',
        enableCellEdit: false,
        width: 90
      }, {
        field: 'replyTime',
        displayName: 'Reply Time',
        enableCellEdit: false,
        width: 85
      }, {
        field: 'resp',
        displayName: 'Resp',
        cellTemplate: '<div ng-class="{\'green\': row.entity.resp == \'VE\',\'red\': row.entity.resp == \'AS\',\'yellow\': row.entity.resp == \'YK\',\'blue\': row.entity.resp == \'DP\' }" " ><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
        enableCellEdit: true,
        editableCellTemplate: $scope.cellSelectEditableTemplateResp,
        width: 50
      }, {
        field: 'outdated',
        displayName: 'Outdated',
        enableCellEdit: permission,
        editableCellTemplate: $scope.cellSelectEditableTemplateOutdated,
        width: 75
      },
      // {
      //   cellTemplate: '<div name={{row.entity._id}}  class=\'calendar-cell \' popover="<div  id=\'calendar\'></div><script src=\'js/calendar.js\'></script><script src=\'js/getCalendarDataForOneApp.js\'></script>"  popover-placement="left" popover-append-to-body="true">Click</div>',
      //   cellClass: 'calendar-btn',
      //   displayName: 'Calendar',
      //   enableCellEdit: false,
      //   width: 75,
      //   visible: permission
      // },
    ],
    showGroupPanel: true,
    enableColumnResize: true,
    showFilter: true,
    enableRowSelection: false,
    showFooter: true,
    filterOptions: {
      filterText: "",
      useExternalFilter: false
    },
    sortInfo: {
      fields: ['appName'],
      directions: ['asc']
    },
  };

});