angular.module('listings', []).factory('Listings', function($http) {
  var methods = {
    getAll: function() {
      return $http.get('http://localhost:8080/api/listings');
      //return $http.get('//bootcamp-assignment6.herokuapp.com/api/listings');
    },
	
	create: function(listing) {
      return $http.post('http://localhost:8080/api/listings', listing);
      //return $http.post('//bootcamp-assignment6.herokuapp.com/api/listings', listing);
    }, 

    delete: function(id) {
	   /**TODO
        return result of HTTP delete method
       */
      //console.log(id);
      return $http.delete('http://localhost:8080/api/listings/' + id);
      //return $http.delete('//bootcamp-assignment6.herokuapp.com/api/listings/' + id);
    }
  };

  return methods;
});