angular.module('sdpSubscribe', [])

.factory('Subscribe', function ($http) {
  return {
    get: function() {
      return $http.get('/tools/subscribemember/all');
    },
    startWatch: function(id, data) {
      return $http.put('/tools/subscribemember/watch/' + id, data);
    },
    unsubscribe: function(id, subId) {
      return $http.put('/tools/subscribemember/unsubscribe/' + id, subId);
    }
  }
})

.factory('Members', function($http) {
    return {
      get: function() {
        return $http.get('/tools/sbcMember/getall');
      }
    };
})

.controller('subscribe', function($scope, Subscribe, Members) {
  $scope.data = {};
  $scope.subList = [];
  $scope.endOfWatch = false;

  Subscribe.get()
  .success(function(data) {
    $scope.data = data;

    $scope.watching = data.filter(function(s) {
      return s.watch === true;
    });

    $scope.notWatching = data.filter(function(s) {
      return (s.watch === false) || (s.watch === undefined);
    });

    console.log($scope.watching);

  });



  Members.get()
  .success(function(data) {
    $scope.subscribers = data;
    $scope.form = {
      applications: $scope.watching,
      subscribers: [],
      subList: [],
      subId: []
    }
    Object.assign($scope.form.subscribers, $scope.subscribers);
    console.log($scope.form)
  });

  $scope.submit = function() {

    console.dir({
      subscribers: $scope.form.subId
    });

    Subscribe.startWatch($scope.newAppSubId, $scope.form.subId)
    .success(function() {
      $scope.newAppSubId = null;
      console.log('SUCCESS');
      $('.modal').modal('hide');
    });

    // console.log($scope.newAppSubId);
    // console.log($scope.notWatching);
    for(var i = 0; i < $scope.notWatching.length; i++) {
      if($scope.notWatching[i]._id == $scope.newAppSubId) {
        $scope.notWatching[i].subscribers = $scope.notWatching[i].subscribers.concat($scope.form.subId);
        $scope.watching.push($scope.notWatching[i]);
        $scope.notWatching.splice(i, 1);
      }
    }
    // for(app in $scope.notWatching) {
    //   console.log($scope.notWatching[app]);
    // }
  }

  $scope.addSubscribe = function(data) {
    // console.log($scope.form.subscribers, $scope.form.subscribers.length);
    for (var i = 0; i < $scope.form.subscribers.length; i++) {
      if($scope.form.subscribers[i] && $scope.form.subscribers[i].name == data)  {
        $scope.form.subId.push($scope.subscribers[i]);
        $scope.form.subList.push(data);
        // var index = $scope.form.subscribers.indexOf($scope.form.subscribers[i]);
        $scope.form.subscribers.splice(i, 1)
        $scope.newSub = null;
      }
    }
  }

  $scope.clearForm = function() {
    $scope.form = {
      applications: $scope.watching,
      subList: [],
      subId: [],
      subscribers: []
    };
    Object.assign($scope.form.subscribers, $scope.subscribers);
    $scope.newAppSubId = null;
  }

  $scope.$watch('form.subList', function(c) {
    console.log("New array: " + c)
  }, true);

  $scope.unsubscribe = function(id) {

  }

  // $scope.$watch('subscribers', function(c) {
  //   console.log(c);
  // }, true);


});
