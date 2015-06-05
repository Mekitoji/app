angular.module('project')

.controller('ListCtrl', function ($scope, $http, Apps, iTester, Calendar) {

  //Ng-options object Select->Option
  //watch part with  template
  $scope.loc = 'Main';
  $scope.year = document.location.pathname.split('/')[2];

  var gridOpt = {};
  var permission;
  var locationC = document.URL.split('/')[3];
  if (locationC === 'cis') {
    gridOpt.country = ["Russia", "Ukraine", "Belarus", "Latvia", "Kazakhstan", "Lithuania", "Estonia", "Uzbekistan", "Kyrgyzstan", "Tajikistan"];
    if (userG === 'gkCIS' || userG === 'root') {
      permission = true;
      $scope.perm = true;
    } else {
      permission = false;
      $scope.perm = false;
    }
  } else if (locationC === 'eu') {
    gridOpt.country = ["Andora","Albania","Armenia","Austria","Azerbaijan","Bosnia and Herzegovina","Belgium","Bulgaria","Switzerland","Christmas Island","Czech Republic","Germany","Denmark","Estonia","Spain","Finland","Faeroe Islands","France","United Kingdom","Georgia","Gibraltar","Greenland","Greece","Croatia","Hungary","Ireland","Iceland","Italy","Lithuania","Luxembourg","Latvia","Monaco","Republic of Moldova","Montenegro","Republic of Macedonia","Netherlands","Norway","Poland","Portugal","Romania","Serbia","Sweden","Slovenia","Slovakia","Wallis and Futuna Islands"];
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

  gridOpt.country ? gridOpt : [];

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
        "values": gridOpt.country
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
  });

  $scope.removeRow = function ($event, entity) {
    $event.stopPropagation();
    $scope.apps.splice($scope.apps.indexOf(entity), 1);
  };

  $scope.cellSelectEditableTemplateCountry = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.countryProp.values" />';
  $scope.cellSelectEditableTemplateCategory = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.categoryProp.values" />';
  $scope.cellSelectEditableTemplateSdpStatus = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.sdpStatusProp.values" />';
  $scope.cellSelectEditableTemplateTv = '<select watch-elem ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.tvProp.values" />';
  $scope.cellSelectEditableTemplateResp = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options="v for v in Options.respProp.values" />';
  $scope.cellSelectEditableTemplateCurrentStatus = '<input auto-complete ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" type="text" />';
  $scope.cellSelectEditableTemplateOutdated = '<select  ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.outdated.values" />';
  $scope.cellSelectEditableTemplateCalendar = '<select  ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD"><option ng-repeat="v in Options.calendar.values" ng-class="{\'greenCalendar\': v == \'D\',\'orange\': v == \'L\',\'calendarll\': v == \'LL\',\'purple-calendar\': v == \'H\' }">{{v}}</option></select>';
  $scope.cellSelectEditableTemplateColor = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.color.values" />';
  $scope.cellSelectEditableTemplateUpdateTime = '<input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD"  type="date" />';

  Apps.get()

  .success(function (data) {
    $scope.apps = _.filter(data, function (d) {
      return d.year == $scope.year;
    });

    $scope.$watch('apps', function (newVal, old) {
      old = newVal;
    });

    var cdate = formatDate(new Date());

    Calendar.get()
      .success(function (calData) {
        $scope.calendarr = calData;
        var result = {};
        for (var k = 0; k < $scope.calendarr.length; k++) {
          var dep = {};
          result[$scope.calendarr[k].appId._id] = {};
          for (var v = 0; v < $scope.calendarr[k].storage.length; v++) {
            dep[$scope.calendarr[k].storage[v].fullDate] = $scope.calendarr[k].storage[v].value;
            result[$scope.calendarr[k].appId._id] = dep;
          }
        }

        for (var i = 0; i < $scope.apps.length; i++) {
          var mapC = createMap($scope.apps[i], $scope.calendarr);
          var cc   = checkAppDate(cdate, mapC)
          console.log(cc)
          if(cc) {
            $scope.apps[i].out = true;
          } else {
            $scope.apps[i].out = false;
          }
          for (var j = 0; j < $scope.calendarr.length; j++) {
            if ($scope.apps[i]._id === calData[j].appId._id) {
              $scope.apps[i].calendar = result[calData[j].appId._id][getCurrentDate()];
            }
          }
        }
      });
  })
.finally(function(){
  $scope.loading = false;
  $scope.dataLoad = true;
  console.log($scope.apps);
});



  Calendar.get()

  .success(function (data) {
    $scope.calData = data;
  });


  $scope.getRowIndex = function () {
    var index = this.row.rowIndex;
    // $scope.gridOptions.selectItem(index, false);
    return index + 1;
  };

  $scope.$on('ngGridEventStartCellEdit', function (elm) {
    // elm.targetScope.col.cellClass = 'blue';

  });

  var getCurrentDate = function getCurrentDate() {
    var date = new Date();
    var dd = date.getDate();
    var dm = date.getMonth() + 1;
    var dy = date.getFullYear();
    if (dm < 10) {
      dm = '0' + dm;
    }
    if (dd < 10) {
      dd = '0' + dd;
    }
    return dy + '-' + dm + '-' + dd;
  };


  $scope.$on('ngGridEventEndCellEdit', function (evt) {
    var currentObj = evt.targetScope.row.entity;
    var displayName = evt.targetScope.col.displayName;

    if (displayName === 'Calendar') {
      for (var i = 0; i < $scope.calData.length; i++) {
        if ($scope.calData[i].appId._id === currentObj._id) {
          Calendar.update($scope.calData[i]._id, {
            value: evt.targetScope.row.entity.calendar,
            fullDate: getCurrentDate()
          });
        }
      }
    } else if (displayName !== 'TV') {
      //update database value
      var projectUrl = currentObj._id;
      Apps.update(projectUrl, currentObj)
        .success(function (data) {
          $scope.formData = data;
        });
    }

  });

  $scope.dateParse = function (data) {
    return Date.parse(data);
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
      cellTemplate: '<div ng-class="{ red: row.entity.out===true, pink: currenDate-dateParse(row.getProperty(col.field))>604800000}"><div class="ngCellText">{{row.getProperty(col.field)|date:\'YYYY-MM-DD\'-1}}</div></div>',
      enableCellEdit: permission,
      editableCellTemplate: $scope.cellSelectEditableTemplateUpdateTime,
      cellFilter: 'date:\'MM/dd/yyyy\'',
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
      cellTemplate: '<div class={{row.entity.color}} ><div ng-class="{\'purple\': row.entity.currentStatus == \'Waiting for QA\',\'orange\': row.entity.currentStatus== \'Waiting for review\',\'grey\': row.entity.currentStatus== \'Not Reviewed\',\'green\':row.entity.currentStatus==\'Waiting for fix\'}" style="color:black" class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
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
      field: 'resp',
      displayName: 'Resp',
      cellTemplate: '<div ng-class="{\'green\': row.entity.resp == \'VE\',\'red\': row.entity.resp == \'AS\',\'yellow\': row.entity.resp == \'YK\',\'blue\': row.entity.resp == \'DP\' }" " ><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
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
      field: 'calendar',
      displayName: 'Calendar',
      cellClass: 'calendar',
      cellTemplate: '<div check-empty ng-class="{\'greenCalendar\': row.entity.calendar == \'D\',\'orange-calendar\': row.entity.calendar == \'L\',\'calendarll\': row.entity.calendar == \'LL\',\'purple-calendar\': row.entity.calendar == \'H\' }" " ><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
      editableCellTemplate: $scope.cellSelectEditableTemplateCalendar,
      visible: permission,
      enableCellEdit: permission,
      width: 75,
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
    }
  };
});


function createMap(app, c) {
  var storageMap = [];
  _.each(c, function (ca) {
    if (ca.appId._id === app._id) {
      _.each(ca.storage, function (cd) {
        storageMap[cd.fullDate] = cd.value;
      });
    }
  });
  return storageMap;
}

function checkAppDate(cdate, map) {
  var LIMIT = 14;
  var DAY_COUNT = 2;
  var prevDate = new Date();
  prevDate.setDate(prevDate.getDate() - 1);
  var fDate = formatDate(prevDate);
  switch (map[cdate]) {
  case "L":
  case "H":
  case "D":
    return false;
    break;
  default:

    var count = 0;
    for (var i = 0; i <= LIMIT; i++) {
      switch (map[fDate]) {
      case "H":
      case "D":
      case "L":
        return false;
        break;
      case "LL":
        count++;
        if (count >= DAY_COUNT) {
          return true;
        }
        break;
      default:
        // console.log(map[fDate], fDate);
        // console.log(map)
        break;
      }
      prevDate.setDate(prevDate.getDate() - 1);
      fDate = formatDate(prevDate);
    }
    return false;
    break
  }
}

function formatDate(dx) {
  var dd = dx.getDate();
  var dm = dx.getMonth() + 1;
  var dy = dx.getFullYear();

  if (dd.toString().length === 1) {
    dd = '0' + dd;
  }

  if (dm.toString().length === 1) {
    dm = '0' + dm;
  }

  var d = dy + "-" + dm + "-" + dd
  return d;
}