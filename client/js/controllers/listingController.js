angular.module('listings').controller('ListingsController', ['$scope', 'Listings', 
  function($scope, Listings) {
    /* Get all the listings, then bind it to the scope */
    Listings.getAll().then(function(response) {
      $scope.listings = response.data;
    }, function(error) {
      console.log('Unable to retrieve listings:', error);
    });

    $scope.detailedInfo = undefined;
 
	  /**TODO 
	  *Save the article using the Listings factory. If the object is successfully 
	  saved redirect back to the list page. Otherwise, display the error
	 */
    $scope.addListing = function() {
      //$scope.listings.push($scope.newListing);
      Listings.create($scope.newListing).then(function(response){
        Listings.getAll().then(function(response){   
        // redirect back to the list page
        console.log(response.data);
        $scope.listings = response.data;
        //window.location.href = '/';
      }, function(error){
        console.log('Unable to create listings:', error);
      });
    });
      $scope.newListing = ""; // clears the form after submitting
    };
    
	   /**TODO
        Delete the article using the Listings factory. If the removal is successful, 
		    navigate back to 'listing.list'. Otherwise, display the error. 
       */
    $scope.deleteListing = function(index) {
      Listings.delete($scope.listings[index]._id).then(function(response){ // _id is from Mlab
      Listings.getAll().then(function(response){  // navigate back to 'listing.list'
      }, function(error){
        console.log('Unable to delete listings:', error);
        console.log(response.data);
      });
    });
      $scope.listings.splice(index,1);
    };

    $scope.showDetails = function(index) {
      $scope.detailedInfo = $scope.listings[index];
    };
  }
]);