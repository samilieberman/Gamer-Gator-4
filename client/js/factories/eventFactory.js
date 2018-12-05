angular.module('events', []).factory('Events', function($http) {
  var methods = {

    getAll: function() {
      //return $http.get('http://localhost:8080/api/events');
      return $http.get('//gamergator.herokuapp.com/api/events');
    },

      create: function(event) {
      //return $http.post('http://localhost:8080/api/events', event);
      return $http.post('//gamergator.herokuapp.com/api/events', event);
    }, 

    delete: function(id) {
	   /**TODO
        return result of HTTP delete method
       */
      //console.log(id);
      //return $http.delete('http://localhost:8080/api/events/' + id);
      return $http.delete('//gamergator.herokuapp.com/api/events/' + id);
    },

    update: function(id, event) {
      //return $http.put('http://localhost:8080/api/events/' + id, event);
      return $http.put('//gamergator.herokuapp.com/api/events/' + id, event);

    }
  };

  return methods;
});
