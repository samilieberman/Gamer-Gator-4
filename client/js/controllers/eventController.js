angular.module('events').controller('EventsController', ['$scope', 'Events','$compile', '$http', '$timeout', 'uiCalendarConfig',
  function ($scope, Events, $compile, $http, $timeout, uiCalendarConfig) {

      /* Get all the listings, then bind it to the scope */
    Events.getAll().then(function (response) {
      $scope.events = response.data;

    }, function (error) {
      console.log('Unable to retrieve listings:', error);
    });

    $scope.detailedInfo = undefined;
    $scope.currentIndex = -1;

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
      var startConcat = $scope.start.year + "-" + $scope.start.month + "-" + $scope.start.day + "T" + $scope.start.hour + ":00:00Z";
      var endConcat = $scope.end.year + "-" + $scope.end.month + "-" + $scope.end.day + "T" + $scope.end.hour + ":00:00Z";
      //catch exceptions?
      $scope.newEvent.start = new Date(startConcat);
      $scope.newEvent.end = new Date(endConcat);

      console.log($scope.newEvent.latitude);
      console.log($scope.newEvent.longitude);

      Events.create($scope.newEvent).then(function (response) {
        Events.getAll().then(function (response) {
          // redirect back to the list page
          console.log(response.data);
          $scope.events = response.data;
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

    $scope.updatedStartTime = {};
    $scope.updatedEndTime = {};

    $scope.fillUpdateInput = function (index) {
      $scope.updatedEvent = $scope.events[index];
      console.log($scope.updatedEvent.start);
      $scope.updatedStartTime.year = $scope.updatedEvent.start.substring(0,4);
      $scope.updatedStartTime.month = $scope.updatedEvent.start.substring(5,7);
      $scope.updatedStartTime.day = $scope.updatedEvent.start.substring(8,10);
      $scope.updatedStartTime.hour = $scope.updatedEvent.start.substring(11,13);
      $scope.updatedEndTime.year = $scope.updatedEvent.end.substring(0,4);
      $scope.updatedEndTime.month = $scope.updatedEvent.end.substring(5,7);
      $scope.updatedEndTime.day = $scope.updatedEvent.end.substring(8,10);
      $scope.updatedEndTime.hour = $scope.updatedEvent.end.substring(11,13);
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
              displayEventTime: false,
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
