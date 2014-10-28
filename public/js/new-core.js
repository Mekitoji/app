angular.module('project', ['ngRoute', 'ngGrid', 'ui.bootstrap'])

.directive('autoComplete', function ($timeout) {
  return function ($scope, elem) {
    elem.autocomplete({
      source: ["Waiting for fix", "Waiting for review", "Waiting for QA", "Waiting for answer", "Waiting for check", "Approved"],
      select: function () {
        $timeout(function () {
          elem.trigger('input');
        }, 0);
      }
    });
  };
})

.filter('unsafe', ['$sce',
  function ($sce) {
    return function (val) {
      return $sce.trustAsHtml(val);
    };
  }
])

.directive('watchElem', [

  function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {


        scope.$watch(function () {
          return element.val();
        }, function (newValue) {
          console.log(element.val());
          console.log(newValue);
          var conf;
          if (newValue === '0') {
            conf = confirm('Are you sure you want to approve the App?');
            if (conf) {
              $('#clickHere').trigger('focus');
              location.reload();
            } else {
              element.val(1);
              newValue = 1;
              location.reload();
            }
          }

          if (newValue === '2') {
            conf = confirm('Are you sure you want to partially approve the App?');
            if (conf) {
              $('#clickHere').trigger('focus');
              location.reload();
            } else {
              element.val(1);
              newValue = 1;
              location.reload();
            }
          }

        });
      }
    };
  }
])

//removed
// .run(["$templateCache",
//   function ($templateCache) {
//     $templateCache.put("template/popover/popover.html",
//       "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
//       "  <div class=\"arrow\"></div>\n" +
//       "\n" +
//       "  <div class=\"popover-inner\">\n" +
//       "      <h3 class=\"popover-title\" ng-bind-html=\"title | unsafe\" ng-show=\"title\"></h3>\n" +
//       "      <div class=\"popover-content\"ng-bind-html=\"content | unsafe\"></div>\n" +
//       "  </div>\n" +
//       "</div>\n" +
//       "");
//   }
// ])


//Apps api
.factory('Apps', function ($http) {
  return {
    get: function () {
      return $http.get('/api/gk/');
    },
    getApproved: function () {
      return $http.get('/api/gk/approved');
    },
    getRejected: function () {
      return $http.get('/api/gk/rejected');
    },
    getOutdated: function () {
      return $http.get('/api/gk/outdated');
    },
    create: function (appData) {
      return $http.post('/api/gk', appData);
    },
    update: function (id, appData) {
      return $http.put('/api/gk/' + id, appData);
    },
    delete: function (id) {
      return $http.delete('api/gk/' + id);
    }
  };
})


.factory('Tester', function ($http) {
  return {
    get: function () {
      return $http.get('/api/tester');
    },
    // post: function() {
    //   return $http.post('/api/tester');
    // },
    update: function (id, testerData) {
      return $http.put('/api/tester/' + id, testerData);
    },
  };
})

//routes
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'ListCtrl',
      templateUrl: 'list.html'
    })
    .when('/approved', {
      controller: 'approvedListCtrl',
      templateUrl: 'list.html'
    })
    .when('/inwork', {
      controller: 'inWorkListCtrl',
      templateUrl: 'list.html'
    })
    .when('/outdated', {
      controller: 'outdatedListCtrl',
      templateUrl: 'list.html'
    })
    .when('/edit/:appId', {
      controller: 'EditCtrl',
      templateUrl: 'detail.html'
    })
    .when('/new', {
      controller: 'CreateCtrl',
      templateUrl: 'detail.html'
    })
    .when('/calendar', {
      templateUrl: 'calendar.html'
    })
    .when('/new_Test', {
      controller: 'NewTesterCtrl',
      templateUrl: 'test_detail.html'
    })
    .when('/test', {
      controller: 'TesterCtrl',
      templateUrl: 'test.html'
    });

})

.controller('ListCtrl', function ($scope, $http, Apps) {

  //Ng-options object Select->Option
  //watch part with  template
  $scope.loc = 'Main';

  var permission;
  // take permission right from server
  if (userG === 'gk' || userG === 'root') {
    permission = true;
    $scope.perm = true;
  } else {
    permission = false;
    $scope.perm = false;
  }

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
      "name": "Tv",
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
      "values": ["Waiting for fix", "Waiting for review", "Waiting for QA", "Approved"]
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

  //let get template for our editable part 
  //mb in diff file
  $scope.cellSelectEditableTemplateCountry = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.countryProp.values" />';
  $scope.cellSelectEditableTemplateCategory = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.categoryProp.values" />';
  $scope.cellSelectEditableTemplateSdpStatus = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.sdpStatusProp.values" />';
  $scope.cellSelectEditableTemplateTv = '<select watch-elem ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.tvProp.values" />';
  $scope.cellSelectEditableTemplateResp = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.respProp.values" />';
  $scope.cellSelectEditableTemplateCurrentStatus = '<input auto-complete ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" type="text" />';
  $scope.cellSelectEditableTemplateOutdated = '<select  ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.outdated.values" />';
  $scope.cellSelectEditableTemplateColor = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.color.values" />';
  $scope.cellSelectEditableTemplateUpdateTime = '<input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD"  type="date" />';

  $scope.edit = false; //old value - delete?

  //get list of apps
  Apps.get()
    .success(function (data) {
      $scope.apps = data;
      $scope.$watch('apps', function (newVal, old) {
        old = newVal;
      });
    });

  $scope.getRowIndex = function () {
    var index = this.row.rowIndex;
    // $scope.gridOptions.selectItem(index, false);
    return index + 1;
  };

  $scope.$on('ngGridEventStartCellEdit', function (elm) {
    console.log(elm.targetScope);
    // elm.targetScope.col.cellClass = 'blue';
    console.log(elm.targetScope.col);

  });

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
        cellTemplate: '<div class={{row.entity.color}} ><div ng-class="{\'purple\': row.entity.currentStatus == \'Waiting for QA\',\'orange\': row.entity.currentStatus== \'Waiting for review\',\'green\':row.entity.currentStatus==\'Waiting for fix\'}" style="color:black" class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
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
        enableCellEdit: permission,
        editableCellTemplate: $scope.cellSelectEditableTemplateResp,
        width: 50
      }, {
        field: 'outdated',
        displayName: 'Outdated',
        enableCellEdit: permission,
        editableCellTemplate: $scope.cellSelectEditableTemplateOutdated,
        width: 75
      },
      // move script to the header will fix bug with fail first click
      // {
      //   cellTemplate: '<div name={{row.entity._id}}  class=\'calendar-cell \' popover="<div  id=\'calendar\'></div><script src=\'js/calendar.js\'></script><script src=\'js/getCalendarDataForOneApp.js\'></script>"  popover-placement="left" popover-append-to-body="true">Click</div>',
      //   cellClass: 'calendar-btn',
      //   displayName: 'Calendar',
      //   enableCellEdit: false,
      //   visible: permission,
      //   width: 75
      // },
      {
        field: '_id',
        visible: false,
      }
    ],
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
})

.controller('outdatedListCtrl', function ($scope, $http, Apps) {

  $scope.loc = 'Outdated';
  var permission;
  // take permission right from server
  if (userG === 'gk' || userG === 'root') {
    permission = true;
    $scope.perm = true;
  } else {
    permission = false;
    $scope.perm = false;
  }

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
      "name": "Tv",
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

  $scope.cellSelectEditableTemplateCountry = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.countryProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateCategory = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.categoryProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateSdpStatus = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.sdpStatusProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateTv = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.tvProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateResp = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.respProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateCurrentStatus = '<input auto-complete ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" type="text" />';
  $scope.cellSelectEditableTemplateOutdated = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.outdated.values" />';
  $scope.cellSelectEditableTemplateColor = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.color.values" />';
  $scope.cellSelectEditableTemplateUpdateTime = '<input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD"  type="date" />';

  $scope.edit = false;

  Apps.getOutdated()

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
        displayName: 'Tv',
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
        enableCellEdit: permission,
        editableCellTemplate: $scope.cellSelectEditableTemplateResp,
        width: 50
      }, {
        field: 'outdated',
        displayName: 'Outdated',
        enableCellEdit: permission,
        editableCellTemplate: $scope.cellSelectEditableTemplateOutdated,
        width: 75
      },
      //  {
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
})

.controller('approvedListCtrl', function ($scope, $http, Apps) {
  $scope.loc = 'Approved';
  var permission;
  // take permission right from server
  if (userG === 'gk' || userG === 'root') {
    permission = true;
    $scope.perm = true;
  } else {
    permission = false;
    $scope.perm = false;
  }

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
      "values": ["Approve", "Reject", "Partial"]
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
  };

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
      enableCellEdit: false
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
      width: 100
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
      field: 'replyTime',
      displayName: 'Reply Time',
      enableCellEdit: false,
      width: 85
    }, {
      field: 'resp',
      displayName: 'Resp',
      cellTemplate: '<div ng-class="{\'green\': row.entity.resp == \'VE\',\'red\': row.entity.resp == \'AS\',\'yellow\': row.entity.resp == \'YK\',\'blue\': row.entity.resp == \'DP\' }" " ><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
      enableCellEdit: false,
      editableCellTemplate: $scope.cellSelectEditableTemplateResp,
      width: 50
    }, ],
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
})

.controller('inWorkListCtrl', function ($scope, $http, Apps) {
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
})


.controller('NewTesterCtrl', function ($scope, $http, Apps, Tester) {



  $scope.testCycle = {};
  Apps.get()
    .success(function (apps) {
      $scope.apps = apps;
      $scope.temps = [];
      for (var i = 0; i < apps.length; i++) {
        $scope.temps[i] = apps[i].appName;
      }
      console.log($scope.temps);
    });

  Tester.get()
    .success(function (tester) {
      $scope.testerDatas = tester;
    });

  $scope.createNewTestCycle = function () {
    // $scope.testCycle.tester
    console.log($scope.Tester1._id);
    console.log($scope.testCycle);
    Tester.update($scope.Tester1._id, $scope.testCycle)
      .success(function (data) {
        $scope.testerDatas = data;
        $scope.testCycle = {};
      });
  };
})

.controller('TesterCtrl', function ($scope, $http, Apps, Tester) {
  //get our app list
  var permission;
  // take permission right from server
  if (userG === 'gk' || userG === 'root') {
    permission = true;
    $scope.perm = true;
  } else {
    permission = false;
    $scope.perm = false;
  }


  Apps.get()
    .success(function (data) {
      $scope.apps = data;
    });

  //get our calendar list
  Tester.get()
    .success(function (data) {
      $scope.testerDatas = data;
    });


})

.controller('CreateCtrl', function ($scope, $http, Apps) {
  $scope.formData = {};
  $scope.createApp = function () {
    Apps.create($scope.formData)

    .success(function (data) {
      $scope.apps = data;
      $scope.formData = {};
    });
  };
})

.controller('EditCtrl', function ($scope, $routeParams, $location, $http, Apps) {

  $scope.edit = true;
  var projectUrl = $routeParams.appId;
  Apps.update(projectUrl, $scope.formData)
    .success(function (data) {
      $scope.formData = data;

    });

  $scope.deleteApp = function (id) {
    Apps.delete(id, $scope.formData)
      .success(function (data) {
        $scope.apps = data; //get new list
        $location.path('/');
      });
  };

  $scope.updateApp = function (id) {
    Apps.update(id, $scope.formData)
      .success(function (data) {
        $scope.apps = data;
        $location.path('/');
      });
  };

})

.controller('mainController', function ($scope, $http, Apps) {
  //get formData clear
  $scope.formData = {};
  //get  all apps and show them
  Apps.get()
    .success(function (data) {
      $scope.apps = data;
    });

  $scope.createApp = function () {
    Apps.create($scope.formData)
      .success(function (data) {
        $scope.apps = data;
        $scope.formData = {};
      });
  };

  $scope.deleteApp = function (id) {
    Apps.delete(id)
      .success(function (data) {
        $scope.apps = data; //get new list
      });
  };

  $scope.updateApp = function (id) {
    Apps.update(id, $scope.formData)
      .success(function (data) {
        $scope.apps = data;
      });
  };
});