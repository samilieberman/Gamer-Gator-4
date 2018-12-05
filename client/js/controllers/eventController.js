angular.module('events').controller('EventsController', ['$rootScope', '$scope', 'Events','$compile', '$location', '$http', '$timeout', 'uiCalendarConfig', '$window',
  function ($rootScope, $scope, Events, $compile, $location, $http, $timeout, uiCalendarConfig, $window) {

    $scope.markers = new Array();

    $rootScope.go = function(path){
            $location.path(path);
    };
    
      /* Get all the listings, then bind it to the scope */
    Events.getAll().then(function (response) {
      $scope.events = response.data;

      for(var i = 0; i < $scope.events.length; i++)
        {
            $scope.markers.push({
                title: $scope.events[i].title,
                lat: $scope.events[i].latitude,
                lng: $scope.events[i].longitude
            });
        }

    }, function (error) {
      console.log('Unable to retrieve listings:', error);
    });


    $scope.detailedInfo = undefined;
    $scope.currentIndex = -1;

    $scope.newEvent = {};
    $scope.updatedEvent = {};

    $scope.updatedStart = {};
    $scope.updatedEnd = {};

    // Initializing info for date picker
    $scope.months=[];
    for (var i = 1; i <= 12; ++i) {
      if (i < 10)
        $scope.months.push("0" + i.toString());
      else
        $scope.months.push(i.toString());
    }

    $scope.days = [];
    for (var i = 1; i <= 31; ++i) {
      if (i < 10)
        $scope.days.push("0" + i.toString());
      else
        $scope.days.push(i.toString());
    }

    $scope.hours = [];
    for (var i = 1; i <= 24; ++i) {
      if (i < 10)
        $scope.hours.push("0" + i.toString());
      else
        $scope.hours.push(i.toString());
    }

    // Get Filter Values
    $scope.getFilterVal = function(tag) {
      $scope.searchInput = tag.currentTarget.value;
    };


    // Event CRUD

    $scope.addEvent = function () {
      console.log($window.lat);
      console.log($window.lng);
      $scope.location = $window.locat;
      $scope.lat = $window.lat;
      $scope.lng = $window.lng;

      $scope.newEvent.location = $scope.location;
      $scope.newEvent.latitude = $scope.lat;
      $scope.newEvent.longitude = $scope.lng;

      var startConcat = $scope.start.year + "-" + $scope.start.month + "-" + $scope.start.day + "T" + $scope.start.hour + ":00:00Z";
      var endConcat = $scope.end.year + "-" + $scope.end.month + "-" + $scope.end.day + "T" + $scope.end.hour + ":00:00Z";
      //catch exceptions?
      $scope.newEvent.start = new Date(startConcat);
      $scope.newEvent.end = new Date(endConcat);

      console.log($scope.newEvent.location);
      console.log($scope.newEvent.latitude);
      console.log($scope.newEvent.longitude);

      if($rootScope.currentUser) { $scope.newEvent.creatorUsername = $rootScope.currentUser.username; }
      else { $scope.newEvent.creatorUsername = "admin"; }
      console.log('Set event owner: '+$scope.newEvent.creatorUsername);

      Events.create($scope.newEvent).then(function (response) {
        Events.getAll().then(function (response) {
          // redirect back to the list page
          console.log(response.data);
          $scope.events = response.data;

          //update markers array after adding event
            for(var i = 0; i < $scope.events.length; i++)
            {
                $scope.markers.push({
                    title: $scope.events[i].title,
                    lat: $scope.events[i].latitude,
                    lng: $scope.events[i].longitude
                });
            }


          //window.location.href = '/';
        }, function (error) {
          console.log('Unable to create events:', error);
        });
      });
      //$scope.start = {};
      //$scope.end = {};
    };

    $scope.deleteEvent = function (index) {
      console.log(index);
      Events.delete($scope.events[index]._id).then(function (response) { // _id is from Mlab
        Events.getAll().then(function (response) {  // navigate back to 'listing.list'
        }, function (error) {
          console.log('Unable to delete events:', error);
          console.log(response.data);
        });
      });
      $scope.events.splice(index, 1);
    };

    $scope.fillUpdateInput = function (index) {
      $scope.updatedEvent = $scope.events[index];
      console.log($scope.updatedEvent.start);
      $scope.updatedStart.year = $scope.updatedEvent.start.substring(0,4);
      $scope.updatedStart.month = $scope.updatedEvent.start.substring(5,7);
      $scope.updatedStart.day = $scope.updatedEvent.start.substring(8,10);
      $scope.updatedStart.hour = $scope.updatedEvent.start.substring(11,13);
      $scope.updatedEnd.year = $scope.updatedEvent.end.substring(0,4);
      $scope.updatedEnd.month = $scope.updatedEvent.end.substring(5,7);
      $scope.updatedEnd.day = $scope.updatedEvent.end.substring(8,10);
      $scope.updatedEnd.hour = $scope.updatedEvent.end.substring(11,13);
    };

    $rootScope.subscribeUser = function (index) {
        console.log('Subscribing user '+$rootScope.currentUser.username+' to '+$scope.detailedInfo.title);

        $rootScope.currentUser.registeredEvents.push($scope.detailedInfo.title);
        $scope.detailedInfo.participantUsernames.push($rootScope.currentUser.username);

        $scope.updatedEvent = "";
        $scope.updatedEvent = $scope.events[index];
        $scope.updatedEvent.participantUsernames.push($rootScope.currentUser.username);
        $scope.updatedEvent.participantUsernames = [...new Set($scope.updatedEvent.participantUsernames)];

        Events.update($scope.events[index]._id, $scope.updatedEvent).then(function (response) {
          console.log(index);

          $scope.events[index] = $scope.updatedEvent;

          Events.getAll().then(function (response) {
            console.log(response.data);
            $scope.events = response.data;
          }, function (error) {
            console.log('Unable to update events:', error);
            console.log(response.data);
          });
        });
    };

    $rootScope.unsubscribeUser = function(index) {
        for(var i = 0; i < $scope.detailedInfo.participantUsernames.length; i++) {
            if($scope.detailedInfo.participantUsernames[i] === $rootScope.currentUser.username){
                console.log('Unsubscribing user '+$rootScope.currentUser.username+' from '+$scope.detailedInfo.title);
                $scope.detailedInfo.participantUsernames.splice(i, 1);
                break;
            }
        }

        for(var j = 0; j < $rootScope.currentUser.registeredEvents.length; j++) {
            if($rootScope.currentUser.registeredEvents[j] === $scope.detailedInfo.title){
                $rootScope.currentUser.registeredEvents.splice(j, 1);
                return;
            }
        }

      $scope.updatedEvent = "";
      $scope.updatedEvent = $scope.events[index];
      var usernameIndex = $scope.updatedEvent.participantUsernames.indexOf($rootScope.currentUser.username);
      $scope.updatedEvent.participantUsernames.splice(usernameIndex, 1);

      Events.update($scope.events[index]._id, $scope.updatedEvent).then(function (response) {
        console.log(index);

        $scope.events[index] = $scope.updatedEvent;

        Events.getAll().then(function (response) {
          console.log(response.data);
          $scope.events = response.data;
        }, function (error) {
          console.log('Unable to update events:', error);
          console.log(response.data);
        });
      });

    };

    $rootScope.getRegisteredEvents = function() {
      console.log($scope.events);

      for (var i = 0; i < $scope.events.length; ++i) {
        var event = $scope.events[i];
        for (var j = 0; j < event.participantUsernames.length; ++j) {
          var username = event.participantUsernames[j];
          if ($rootScope.currentUser.username == username)
            $rootScope.currentUser.registeredEvents.push(event.title);
        }
      }
      //console.log($rootScope.currentUser.registeredEvents)
    };

    /*$scope.updateEvent = function (index) {

      Events.delete($scope.events[index]._id).then(function (response) { // _id is from Mlab
        Events.getAll().then(function (response) {  // navigate back to 'listing.list'
        }, function (error) {
          console.log('Unable to delete events:', error);
          console.log(response.data);
        });
      });
      $scope.events.splice(index, 1);

      var startConcat = $scope.updatedStartTime.year + "-" + $scope.updatedStartTime.month + "-" + $scope.updatedStartTime.day + "T" + $scope.updatedStartTime.hour + ":00:00Z";
      var endConcat = $scope.updatedEndTime.year + "-" + $scope.updatedEndTime.month + "-" + $scope.updatedEndTime.day + "T" + $scope.updatedEndTime.hour + ":00:00Z";
      //catch exceptions?
      $scope.updatedEvent.start = new Date(startConcat);
      $scope.updatedEvent.end = new Date(endConcat);

      Events.create($scope.updatedEvent).then(function (response) {
        Events.getAll().then(function (response) {
          // redirect back to the list page
          console.log(response.data);
          $scope.events = response.data;
          //window.location.href = '/';
        }, function (error) {
          console.log('Unable to create events:', error);
        });
      });

    };*/

    $scope.updateEvent = function (index) {

      var startConcat = $scope.updatedStart.year + "-" + $scope.updatedStart.month + "-" + $scope.updatedStart.day + "T" + $scope.updatedStart.hour + ":00:00Z";
      var endConcat = $scope.updatedEnd.year + "-" + $scope.updatedEnd.month + "-" + $scope.updatedEnd.day + "T" + $scope.updatedEnd.hour + ":00:00Z";
      $scope.updatedEvent.start = new Date(startConcat);
      $scope.updatedEvent.end = new Date(endConcat);

      Events.update($scope.events[index]._id, $scope.updatedEvent).then(function (response) {
          console.log(index);

          $scope.events[index] = $scope.updatedEvent;

          Events.getAll().then(function (response) {
          console.log(response.data);
          $scope.events = response.data;
        }, function (error) {
          console.log('Unable to update events:', error);
          console.log(response.data);
        });
      });
    };

    $scope.showDetails = function (index) {
      $scope.detailedInfo = $scope.events[index];
      $scope.currentIndex = index;
    };

      var vm = this;

      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();

      $scope.eventSource = [];

      $scope.loadEventList = function () {
          $http({
              method: 'GET',
              url: '/api/events'
          }).then(function (res) {
                  console.log('Successful');
                  console.log(res);
                  //$scope.eventSources = res.data;
                  for(var i = 0; i < res.data.length; i ++){
                      $scope.eventSource.push(res.data[i]);
              }

              },

             function (res) {
                  console.log('Failed');
                  console.log(res);
              });

      };

      $scope.renderCalendar = function(calendar) {
          $timeout(function () {
              if (uiCalendarConfig.calendars[calendar]) {
                  uiCalendarConfig.calendars[calendar].fullCalendar('render');
              }
          });
      };

      $scope.eventRender = function( event, element,view) {
          element.attr({'tooltip': event.title,
              'tooltip-append-to-body': true});
          $compile(element)($scope);
      };

      $scope.uiConfig = {
          calendar: {
              navLinks: true,
              displayEventTime: true,
              defaultTimedEventDuration: '01:00:00',
              height: 900,
              editable: false,
              header: {
                  left: 'title',
                  center: '',
                  right: 'today prev,next'
              },

              eventRender: $scope.eventRender,
          }
      };

      //Events.getAll();

      $scope.loadEventList();

      console.log("Event Source", $scope.eventSource);
      $scope.eventSources = [$scope.eventSource];

  }
]);
