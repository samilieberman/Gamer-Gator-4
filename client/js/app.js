/* register the modules the application depends upon here*/
angular.module('events', []);
angular.module('users', []);
angular.module('ui.calendar',[]);

/* register the application and inject all the necessary dependencies */
var app = angular.module('gamerGatorApp', ['events', 'users','ui.calendar']);