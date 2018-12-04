angular.module('users').controller('UserController', ['$rootScope', '$scope', '$http', '$location',
    function ($rootScope, $scope, $http, $location) {

        $rootScope.register = function(user) {
            console.log('Entering register() function...');

                $http.post('/register', user)
                    .success(function(user) {
                        console.log('Registration success');
                        $rootScope.currentUser = user;
                        $rootScope.successMessage = false;
                        $rootScope.successMessage = "Success! Please log in with your new credentials.";
                        $rootScope.errorMessage = false;
                        $location.url('/login');
                    })
                    .error(function(err){
                        $rootScope.successMessage = false;
                        $rootScope.errorMessage = false;
                        $rootScope.errorMessage = "Error registering user: "+err;
                        $location.url('/register');
                    });

        };

        $rootScope.logoutUser = function() {
            console.log('Entered logout function');
            $http.post("/logout")
                .success(function() {
                    console.log('Logout success');
                    $rootScope.currentUser = false;
                    $rootScope.errorMessage = false;
                    $rootScope.successMessage = false;
                    $rootScope.successMessage = "You have been logged out successfully.";
                    console.log($rootScope.successMessage);
                    $location.url('/home');
                });
        };

        $rootScope.login = function(user) {
            console.log('Entered login function');
            $http.post('/login', user)
                .success(function(response) {
                    console.log('Login success');
                    $rootScope.currentUser = response;
                    $rootScope.successMessage = false;
                    $rootScope.successMessage = "You have been logged in successfully.";
                    $rootScope.errorMessage = false;
                    $location.url("/home");
                })
                .error(function(err){
                    $rootScope.successMessage = false;
                    $rootScope.errorMessage = false;
                    $rootScope.errorMessage = "Error! Incorrect username or password.";
                    $location.url('/login');
                });
        };

    }]);

