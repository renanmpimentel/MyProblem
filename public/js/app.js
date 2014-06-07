'use strict';

var myProblemApp = angular.module('myProblemApp', ['ngRoute', 'controllers']);

 myProblemApp.config(['$routeProvider', '$httpProvider',
 	function ($routeProvider, $httpProvider) {
 		$routeProvider
 			.when('/login',{
 				templateUrl : '/public/login',
 				controller  : 'loginCtrl'
 			})
 			.when('/problemas',{
 				templateUrl : '/protected/partial/problemas',
 				controller  : 'problemaCtrl'
 			})
 			.when('/desenvProblema/:id', {
 				templateUrl : '/protected/partial/desenvolvimentoProblema',
 				controller : 'desenvCtrl'
 			})
 			.otherwise({
 				redirectTo : '/login'
 			});

 		$httpProvider.interceptors.push('authInterceptor');
 	}]);

myProblemApp.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

myProblemApp.factory('socket',['$rootScope', function($rootScope){
  //var host = location.origin.replace(/^http/, 'ws')+':8000';
  var socket = io.connect();

  var addListener = function(name, callback) {
        socket.addListener(name, function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    };

    var emit = function(name, data){
      socket.emit(name, data);
    }

    return {
      on : addListener,
      emit : emit
    }
}]);

