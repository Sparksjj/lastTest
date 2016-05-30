var app = angular.module("myApp", ['ngRoute', 'angularUtils.directives.dirPagination', 'angularFileUpload']);

  app.config(function($routeProvider) {
      $routeProvider
          .when('/', {
              templateUrl: 'views/guestbook.html',
              controller: 'GuestbookController',
          })
          .otherwise({ 
            redirectTo: '/'
          });
  });
/*  
app.config(['$httpProvider', function($httpProvider) {
$httpProvider.defaults.useXDomain = true;
$httpProvider.defaults.withCredentials = true;
delete $httpProvider.defaults.headers.common["X-Requested-With"];
    }
]);*/
app.controller('appCtrl', ['$scope', '$location', '$userProvider', "$http",
    function($scope, $location, $userProvider, $http) {



    }]);