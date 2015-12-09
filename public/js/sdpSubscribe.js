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
    },
    subscribe: function(id, subId) {
      return $http.put('/tools/subscribemember/subscribe/' + id, subId)
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

  });

  $scope.submit = function() {

    console.dir({
      id: $scope.newAppSubId,
      subscribers: $scope.form.subId
    });

    Subscribe.startWatch($scope.newAppSubId, $scope.form.subId)
    .success(function() {
      $scope.newAppSubId = null;

      $('.modal').modal('hide')

      console.log('SUCCESS');
    });

    for(var i = 0; i < $scope.notWatching.length; i++) {
      if($scope.notWatching[i]._id == $scope.newAppSubId) {
        $scope.notWatching[i].subscribers = $scope.notWatching[i].subscribers.concat($scope.form.subId);
        $scope.watching.push($scope.notWatching[i]);
        $scope.notWatching.splice(i, 1);
      }
    }
  }

  $scope.addSubscribe = function(data) {
    for (var i = 0; i < $scope.form.subscribers.length; i++) {
      if($scope.form.subscribers[i] && $scope.form.subscribers[i].name == data)  {
        $scope.form.subId.push($scope.form.subscribers[i]);
        $scope.form.subList.push(data);
        $scope.form.subscribers.splice(i, 1);
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

  $scope.unsubscribe = function(appId, sub) {
    console.log("tracking: Proposal " + appId + " unsubscribe " +  sub);
    // appId, subId
      Subscribe.unsubscribe(appId, {
        sub: sub
      })
        .success(function() {
          console.log("SUCCESS UNSUBSCRIBE");

          // delete subscribtion
          var index = findInCollection($scope.watching, "_id", appId);
          var subIndex = findInCollection($scope.watching[index].subscribers, "_id", sub);
          $scope.watching[index].subscribers.splice(subIndex, 1);

          // move on from watching if sub length = 0;
          if($scope.watching[index].subscribers.length === 0) {
            $scope.watching[index].watch = false;
            $scope.notWatching.push($scope.watching[index]);
            $scope.watching.splice(index, 1);
          }
        });
  }

  function findInCollection(collection, elem, val) {
    for(var i = 0; i <= collection.length; i++) {
      if(collection[i][elem] === val) {
        return i;
      }
    }
  }

});
