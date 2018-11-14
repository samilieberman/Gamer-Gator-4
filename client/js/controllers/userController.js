angular.module('users').controller('UserController', ['$scope', '$rootScope', '$http',
    function ($rootScope, $scope, $http) {

    $scope.isLoggedIn = function() {
        $http.get('/checklogin')
            .success(function(data) {
                console.log(data);
                $rootScope.loggedIn = data;
            })
            .error(function(data) {
                console.log('error: '+data);
            });
    };
  }]);

