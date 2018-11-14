/* register the modules the application depends upon here*/
angular.module('events', []);
angular.module('users', []);

/* register the application and inject all the necessary dependencies */
var app = angular.module('gamerGatorApp', ['events', 'users']);