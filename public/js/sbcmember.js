angular.module('sbcmember', [])

.factory('Members', function($http) {
    return {
      get: function() {
        return $http.get('/tools/sbcMember/getall');
      },
      post: function(data) {
        return $http.post('/tools/sbcMember', data);
      },
      delete: function(id) {
        return $http.delete('/tools/sbcmember/' + id);
      },
      update: function(id, data) {
        return $http.put('/tools/sbcmember/' + id, data)
      }
    }
})

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

.controller('members', function($scope, Members) {
  $scope.data = {};

  function getGroups() {
    var keys = Object.keys(this.groups);
    var groups = this.groups;
    var nGroup = []
    keys.forEach(function(v, i, arr) {
      if (groups[v]) {
        nGroup.push('NEW_' + v.toUpperCase());
      }
    });
    return nGroup;
  };

  function sortName(a, b) {
    switch (a.name.toLowerCase() > b.name.toLowerCase()) {
      case true:
        return 1;
      case false:
        return -1;
      default:
        return 0
    }
  }

  Members.get()
  .success(function(data) {
    $scope.data = data.sort(sortName);
    $scope.data.forEach(function(v) {
      v.getGroups = getGroups;
    });
  });

  $scope.submit = function() {
    if($scope.newName.length > 30) {
      alert('Wrong number of symbols at name field( 30 is the maximum )');
    } else {
      Members.post({
        mail: $scope.newMail,
        name: $scope.newName
      })
      .success(function() {

        $scope.data.push({
          mail: $scope.newMail,
          name: $scope.newName
        })
        $scope.data = $scope.data.sort(sortName)

        $scope.newMail = null;
        $scope.newName = null;
        $('.modal').modal('hide');
      });
    }
  };

  $scope.delete = function(id) {
    var result = confirm("Are you sure you want to remove this member?");
    if (result === true) {
      Members.delete(id)
      .success(function() {
        for(var i =0; i < $scope.data.length; i++) {
          if($scope.data[i]._id === id) {
            $scope.data.splice(i, 1);
            break;
          }
        }
      });
    }
    return;
  };

  $scope.updateMember = function() {
    Members.update($scope.updMember._id, $scope.updMember)
    .success(function() {
      for(var i = 0; i < $scope.data.length; i++) {
        if($scope.data[i]._id === $scope.updMember._id) {
          $scope.data[i] = {
            name: $scope.updMember.name,
            mail: $scope.updMember.mail,
            _id: $scope.updMember._id,
            groups: $scope.updMember.groups,
            getGroups: getGroups,
          };
          break;
        }
      }
    });
    $('.modal').modal('hide');
  }

  $scope.openUpdateForm = function(member) {
    $scope.updMember = Object.assign({}, member);
    $scope.updMember.groups = Object.assign({}, member.groups)
  }
});
