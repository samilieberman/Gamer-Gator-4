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
    };

    $scope.deleteEvent = function (index) {
      Events.delete($scope.events[index]._id).then(function (response) { // _id is from Mlab
        Events.getAll().then(function (response) {  // navigate back to 'listing.list'
        }, function (error) {
          console.log('Unable to delete events:', error);
          console.log(response.data);
        });
      });
      $scope.events.splice(index, 1);
    };

    $scope.updateEvent = function (index) {

      var startTimeConcat = $scope.startTime.year + "-" + $scope.startTime.month + "-" + $scope.startTime.day + "T" + $scope.startTime.hour + ":00:00Z";
      var endTimeConcat = $scope.endTime.year + "-" + $scope.endTime.month + "-" + $scope.endTime.day + "T" + $scope.endTime.hour + ":00:00Z";
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

      Events.delete($scope.events[index]._id).then(function (response) { // _id is from Mlab
        Events.getAll().then(function (response) {  // navigate back to 'listing.list'
        }, function (error) {
          console.log('Unable to delete events:', error);
          console.log(response.data);
        });
      });
      $scope.events.splice(index, 1);
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
    };

    $scope.showDetails = function (index) {
      $scope.detailedInfo = $scope.events[index];
      $scope.currentIndex = index;
    };*/
  }
]);
