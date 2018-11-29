angular.module('events').controller('EventsController', ['$scope', 'Events',
  function ($scope, Events) {

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
      var startTimeConcat = $scope.startTime.year + "-" + $scope.startTime.month + "-" + $scope.startTime.day + "T" + $scope.startTime.hour + ":00:00Z";
      var endTimeConcat = $scope.endTime.year + "-" + $scope.endTime.month + "-" + $scope.endTime.day + "T" + $scope.endTime.hour + ":00:00Z";
      //catch exceptions?
      $scope.newEvent.startTime = new Date(startTimeConcat);
      $scope.newEvent.endTime = new Date(endTimeConcat);

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
      $scope.events = ""; // clears the form after submitting
      $scope.startTime = {};
      $scope.endTime = {};
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
      console.log($scope.updatedEvent.startTime);
      $scope.updatedStartTime.year = $scope.updatedEvent.startTime.substring(0,4);
      $scope.updatedStartTime.month = $scope.updatedEvent.startTime.substring(5,7);
      $scope.updatedStartTime.day = $scope.updatedEvent.startTime.substring(8,10);
      $scope.updatedStartTime.hour = $scope.updatedEvent.startTime.substring(11,13);
      $scope.updatedEndTime.year = $scope.updatedEvent.endTime.substring(0,4);
      $scope.updatedEndTime.month = $scope.updatedEvent.endTime.substring(5,7);
      $scope.updatedEndTime.day = $scope.updatedEvent.endTime.substring(8,10);
      $scope.updatedEndTime.hour = $scope.updatedEvent.endTime.substring(11,13);
    };

    $scope.updateEvent = function (index) {

      Events.delete($scope.events[index]._id).then(function (response) { // _id is from Mlab
        Events.getAll().then(function (response) {  // navigate back to 'listing.list'
        }, function (error) {
          console.log('Unable to delete events:', error);
          console.log(response.data);
        });
      });
      $scope.events.splice(index, 1);

      var startTimeConcat = $scope.updatedStartTime.year + "-" + $scope.updatedStartTime.month + "-" + $scope.updatedStartTime.day + "T" + $scope.updatedStartTime.hour + ":00:00Z";
      var endTimeConcat = $scope.updatedEndTime.year + "-" + $scope.updatedEndTime.month + "-" + $scope.updatedEndTime.day + "T" + $scope.updatedEndTime.hour + ":00:00Z";
      //catch exceptions?
      $scope.updatedEvent.startTime = new Date(startTimeConcat);
      $scope.updatedEvent.endTime = new Date(endTimeConcat);

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
      $scope.events = "";       // clears the form after submitting

    };

    /*$scope.updateEvent = function (index) {
      Events.update($scope.events[index]._id, $scope.updatedEvent).then(function (response) {

          $scope.events[index] = $scope.updatedEvent;

          Events.getAll().then(function (response) {
          console.log(response.data);
          $scope.events = response.data;
        }, function (error) {
          console.log('Unable to update events:', error);
          console.log(response.data);
        });
      });
      $scope.events = ""; // is this necessary
    };*/

    $scope.showDetails = function (index) {
      $scope.detailedInfo = $scope.events[index];
      $scope.currentIndex = index;
    };
  }
]);
