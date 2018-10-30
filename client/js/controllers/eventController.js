angular.module('events').controller('EventsController', ['$scope', 'Events',
  function($scope, Events) {
    /* Get all the listings, then bind it to the scope */
    Events.getAll().then(function(response) {
      $scope.events = response.data;
    }, function(error) {
      console.log('Unable to retrieve listings:', error);
    });

    $scope.detailedInfo = undefined;
 
	  /**TODO 
	  *Save the article using the Events factory. If the object is successfully
	  saved redirect back to the list page. Otherwise, display the error
	 */
    $scope.addEvent = function() {
      //$scope.listings.push($scope.newListing);
      Events.create($scope.newEvent).then(function(response){
        Events.getAll().then(function(response){
        // redirect back to the list page
        console.log(response.data);
        $scope.events = response.data;
        //window.location.href = '/';
      }, function(error){
        console.log('Unable to create events:', error);
      });
    });
      $scope.events = ""; // clears the form after submitting
    };
    
	   /**TODO
        Delete the article using the Events factory. If the removal is successful,
		    navigate back to 'listing.list'. Otherwise, display the error. 
       */
    $scope.deleteEvent = function(index) {
      Events.delete($scope.events[index]._id).then(function(response){ // _id is from Mlab
      Events.getAll().then(function(response){  // navigate back to 'listing.list'
      }, function(error){
        console.log('Unable to delete events:', error);
        console.log(response.data);
      });
    });
      $scope.events.splice(index,1);
    };

    $scope.showDetails = function(index) {
      $scope.detailedInfo = $scope.events[index];
    };
  }
]);