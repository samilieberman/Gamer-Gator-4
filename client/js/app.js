/* register the modules the application depends upon here*/
angular.module('events', []);
angular.module('users', []);
angular.module('ui.calendar',[]);

/* register the application and inject all the necessary dependencies */
var app = angular.module('gamerGatorApp', ['ngRoute', 'events', 'users','ui.calendar']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'UserController'
        })
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'UserController'
        })
        .when('/', {
            templateUrl: 'index.html',
            controller: 'EventsController'
        })
        .otherwise({
            redirectTo: '/',
            controller: 'EventsController'

        });

}]);

var checkLogin = function($q, $timeout, $http, $location, $rootScope) {
    var defer = $q.defer();

    $http.get('/loggedin').success(function(user) {
        $rootScope.errorMessage = null;

        if(user !== '0'){
            $rootScope.currentUser = user;
            defer.resolve();
        }
        else {
            $rootScope.errorMessage = 'Not logged in.';
            defer.reject();
            //$location.url('/login');
        }
    });

    return defer.promise;
};
