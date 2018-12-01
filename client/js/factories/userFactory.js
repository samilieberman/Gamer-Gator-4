angular.module('users', []).factory('Users', function($http) {
  var methods = {

    getAll: function() {
      return $http.get('http://localhost:8080/api/users');
      //return $http.get('//bootcamp-assignment6.herokuapp.com/api/listings');
    },

    register: function(user) {
      return $http.post('http://localhost:8080/api/register', user);
      //return $http.post('//bootcamp-assignment6.herokuapp.com/api/listings', listing);
    },

    login: function() {
        return $http.post('http://localhost:8080/api/login');
    }
  };

  return methods;
});