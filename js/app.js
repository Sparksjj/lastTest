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
