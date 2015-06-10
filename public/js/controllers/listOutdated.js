angular.module('project')


.controller('outdatedListCtrl', function ($scope, $http, Apps, iTester) {

  $scope.loc = 'Outdated';
  var permission;
  var locationC = document.URL.split('/')[3];
  var gridOpt = {};
  $scope.year = document.location.pathname.split('/')[2];
  if (locationC === 'cis') {
    gridOpt.country = ["Russia", "Ukraine", "Belarus", "Latvia", "Kazakhstan", "Lithuania", "Estonia", "Uzbekistan", "Kyrgyzstan", "Tajikistan"];
    gridOpt.respColor = {
      "AS": "red",
      "YK": "yellow",
      "VE": "green",
      "DP": "blue",
    }
    if (userG === 'gkCIS' || userG === 'root') {
      permission = true;
      $scope.perm = true;
    } else {
      permission = false;
      $scope.perm = false;
    }
  } else if (locationC === 'eu') {
    gridOpt.country = ["Andora","Albania","Armenia","Austria","Azerbaijan","Bosnia and Herzegovina","Belgium","Bulgaria","Switzerland","Christmas Island","Czech Republic","Germany","Denmark","Estonia","Spain","Finland","Faeroe Islands","France","United Kingdom","Georgia","Gibraltar","Greenland","Greece","Croatia","Hungary","Ireland","Iceland","Italy","Lithuania","Luxembourg","Latvia","Monaco","Republic of Moldova","Montenegro","Republic of Macedonia","Netherlands","Norway","Poland","Portugal","Romania","Serbia","Sweden","Slovenia","Slovakia","Wallis and Futuna Islands"];
    gridOpt.respColor = {
      "SR": "red",
      "NT": "yellow",
      "EK": "green",
      "AB": "blue",
      "MF": "pink",
      "GS": "purple",
    }
    if (userG === 'gkEU' || userG === 'root') {
      permission = true;
      $scope.perm = true;
    } else {
      permission = false;
      $scope.perm = false;
    }
  } else if (locationC === 'global') {
    if (userG === 'gkEU' || userG === 'root') {
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

  gridOpt.country ? gridOpt.country : [];
  gridOpt.respColor ? gridOpt.respColor : {};

  $scope.loading = true;
  $scope.dataLoad = false;

  iTester.get()

  .success(function (data) {
    $scope.tester = [];
    $scope.testersArr = data;
    $scope.testersArr.forEach(function (item, i) {
      $scope.tester.push(item.name);
    });

    $scope.Options = {
      countryProp: {
        "type": "select",
        "name": "Country",
        "value": "COL_FIELD",
        "values": gridOpt.country,
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
        "values": $scope.tester
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
      calendar: {
        "type": "select",
        "name": 'calendar',
        "value": "COL_FIELD",
        "values": ['H', 'L', 'LL', 'D']
      }

    };
  });

  $scope.removeRow = function ($event, entity) {
    $event.stopPropagation();
    $scope.apps.splice($scope.apps.indexOf(entity), 1);
  };

  $scope.cellSelectEditableTemplateCountry = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.countryProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateCategory = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.categoryProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateSdpStatus = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.sdpStatusProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateTv = '<select watch-elem ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.tvProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateResp = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options="v for v in Options.respProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateCurrentStatus = '<input auto-complete ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" type="text" />';
  $scope.cellSelectEditableTemplateOutdated = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.outdated.values" />';
  $scope.cellSelectEditableTemplateColor = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.color.values" />';
  $scope.cellSelectEditableTemplateUpdateTime = '<input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD"  type="date" />';
  // here
  $scope.cellSelectEditableTemplateCalendarCurrentDate = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.calendar.values" ng-blur="updateEntity(row)" />';

  $scope.edit = false;

  Apps.getOutdated()

  .success(function (data) {
    // $scope.apps = _.filter(data, function (d) {
    //   return d.year == $scope.year;
    // });
    $scope.apps = data;
  })
  .finally(function(){
    $scope.loading = false;
    $scope.dataLoad = true;
  });

  $scope.getRowIndex = function () {
    var index = this.row.rowIndex;
    return index + 1;
  };

  $scope.filterOptions = {
    filterText: "year:" + $scope.year
  }

  $scope.$on('ngGridEventEndCellEdit', function (evt) {
    var currentObj = evt.targetScope.row.entity;
    var displayName = evt.targetScope.col.displayName;
    //update database value
    var projectUrl = currentObj._id;
    if (displayName !== "TV") {
      Apps.update(projectUrl, currentObj)

      .success(function (data) {
        $scope.formData = data;
      });
    }
  });

  $scope.dateParse = function (data) {
    return Date.parse(data);
  };

  $scope.checkResp = function(val) {
    return gridOpt.respColor[val];
  }

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
      width: 100,
      cellFilter: 'date:\'MM/dd/yyyy\'',

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
      cellTemplate: '<div class={{row.entity.color}} ><div ng-class="{\'purple\': row.entity.currentStatus == \'Waiting for QA\',\'grey\': row.entity.currentStatus== \'Not Reviewed\',\'orange\': row.entity.currentStatus== \'Waiting for review\',\'green\':row.entity.currentStatus==\'Waiting for fix\'}" style="color:black" class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
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
      field: 'replyTime.toFixed(2)',
      displayName: 'Review Time',
      enableCellEdit: false,
      width: 85
    }, {
      field: 'year',
      displayName: "year",
      visible: false
    }, {
      field: 'resp',
      displayName: 'Resp',
      cellTemplate: '<div ng-class="checkResp(row.entity.resp)" ><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
      enableCellEdit: permission,
      editableCellTemplate: $scope.cellSelectEditableTemplateResp,
      width: 50
    }, {
      field: 'outdated',
      displayName: 'Outdated',
      enableCellEdit: permission,
      editableCellTemplate: $scope.cellSelectEditableTemplateOutdated,
      width: 75
    }, {
      field: '_id',
      visible: false,
    }],
    showGroupPanel: true,
    enableColumnResize: true,
    showFilter: true,
    showFooter: true,
    enableRowSelection: false,
    filterOptions: $scope.filterOptions,
    sortInfo: {
      fields: ['appName'],
      directions: ['asc']
    },
  };
});