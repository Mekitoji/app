angular.module('project')

.controller('approvedListCtrl', function ($scope, $http, Apps, Tester) {
  $scope.loc = 'Approved';
  var permission;
  // take permission right from server
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

  Tester.get()

  .success(function (data) {
    $scope.tester = [];
    $scope.testersArr = data;
    $scope.testersArr.forEach(function (item, i) {
      $scope.tester.push(item.tester);
    });

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
        "name": "TV",
        "value": "COL_FIELD",
        "values": ["Approved", "In Progress", "Partial"]
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
        "values": ['H', 'D', 'L', 'LL']
      },
    };
  });

  $scope.cellSelectEditableTemplateCountry = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.countryProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateCategory = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.categoryProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateSdpStatus = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.sdpStatusProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateTv = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.tvProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateResp = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.respProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateCurrentStatus = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.currentStatusProp.values" />';
  $scope.cellSelectEditableTemplateUpdateTime = '<input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD"  type="date" />';

  $scope.edit = false;

  Apps.getApproved()
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
      enableCellEdit: false,
      cellFilter: 'hidePrivate'
    }, {
      field: 'country',
      displayName: 'Country',
      enableCellEdit: false,
      editableCellTemplate: $scope.cellSelectEditableTemplateCountry,
      width: 70
    }, {
      field: 'appName',
      displayName: 'Application name',
      enableCellEdit: false,
    }, {
      field: 'category',
      displayName: 'Category',
      enableCellEdit: false,
      editableCellTemplate: $scope.cellSelectEditableTemplateCategory,
      width: 100
    }, {
      field: 'sdpStatus',
      displayName: 'SDP Status',
      enableCellEdit: false,
      editableCellTemplate: $scope.cellSelectEditableTemplateSdpStatus
    }, {
      field: 'updateTime',
      displayName: 'Update date',
      //604800000 ms = 7day
      cellTemplate: '<div ng-class="{pink: currenDate-dateParse(row.getProperty(col.field))>604800000}"><div class="ngCellText">{{row.getProperty(col.field)|date:\'YYYY-MM-DD\'-1}}</div></div>',
      enableCellEdit: false,
      editableCellTemplate: $scope.cellSelectEditableTemplateUpdateTime,
      width: 100,
      cellFilter: 'date:\'MM/dd/yyyy\'',

    }, {
      field: 'seller',
      displayName: 'Seller',
      enableCellEdit: false
    }, {
      field: 'tv',
      displayName: 'Tv',
      enableCellEdit: false,
      editableCellTemplate: $scope.cellSelectEditableTemplateTv,
      width: 80
    }, {
      field: 'currentStatus',
      displayName: 'Current status',
      cellTemplate: '<div" ><div style="black" class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
      enableCellEdit: false,
      editableCellTemplate: $scope.cellSelectEditableTemplateCurrentStatus,
      width: 125
    }, {
      field: 'color',
      displayName: '#',
      enableCellEdit: false,
      cellTemplate: '<div class={{row.entity.color}} "><div  class="ngCellText"></div></div>',
      editableCellTemplate: $scope.cellSelectEditableTemplateColor,
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
      editableCellTemplate: $scope.cellSelectEditableTemplateResp,
      width: 50
    }, {
      field: '_id',
      visible: false,
    }],
    showGroupPanel: true,
    enableColumnResize: true,
    showFilter: true,
    showFooter: true,
    enableRowSelection: false,
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