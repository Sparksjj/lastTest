var app = angular.module("myApp", ['ngRoute', 'angularUtils.directives.dirPagination']);

  app.config(function($routeProvider) {
      $routeProvider
          .when('/', {
              templateUrl: 'views/guestbook.html',
              controller: 'GuestbookController',
          })
          .when('/testpage', {
              templateUrl: 'views/testPage.html',
              controller: 'GuestbookController',
          })
          .otherwise({ 
            redirectTo: '/'
          });
  });

app.controller('appCtrl', ['$scope', '$location', '$userProvider', "$http",
    function($scope, $location, $userProvider, $http) {


    }]);


app.factory('socket', function ($rootScope) {

  
  return {
    socket: function(http){
      return io.connect(http);
    },

    on: function (socket, eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (socket, eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});