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

.controller('members', function($scope, Members) {
  $scope.data = {};

  Members.get()
  .success(function(data) {
    $scope.data = data;
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

        $scope.newMail = null;
        $scope.newName = null;
        $('.modal').modal('hide');
      });
    }
  };

  $scope.delete = function(id) {
    Members.delete(id)
    .success(function() {
      for(var i =0; i < $scope.data.length; i++) {
        if($scope.data[i]._id === id) {
          $scope.data.splice(i, 1);
          break;
        }
      }
    });
  };

  $scope.updateMember = function() {
    Members.update($scope.updMember._id, $scope.updMember)
    .success(function() {
      for(var i = 0; i < $scope.data.length; i++) {
        if($scope.data[i]._id === $scope.updMember._id) {
          $scope.data[i] = {
            name: $scope.updMember.name,
            mail: $scope.updMember.mail,
            _id: $scope.updMember._id
          };
          break;
        }
      }
    });
    $('.modal').modal('hide');
  }

  $scope.openUpdateForm = function(member) {
    $scope.updMember = Object.assign({}, member);
  }
});
