angular.module('users').controller('UserController', ['$rootScope', '$scope', '$http', '$location',
    function ($rootScope, $scope, $http, $location) {

        $scope.register = function(user) {
            console.log('Entering register() function...');

                $http.post('/register', user)
                    .success(function(user) {
                        console.log('Registration success');
                        $rootScope.currentUser = user;
                        $location.url('/login');
                    });

        };

        $scope.logout = function() {
            console.log('Entered logout function');
            $http.post("/logout")
                .success(function() {
                    console.log('Logout success');
                    $rootScope.currentUser = null;
                    $location.url('/home');
                });
        };

        $scope.login = function(user) {
            console.log('Entered login function');
            $http.post('/login', user)
                .success(function(response) {
                    console.log('Login success');
                    $rootScope.currentUser = response;
                    $location.url("/home");
                });
        };

    }]);

