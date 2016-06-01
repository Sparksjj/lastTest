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

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, email, password, name){

        var formData = new FormData();
        formData.append("avatar", file)
        formData.append("email", email)
        formData.append("name", name)
        formData.append("password", password)
/*
      $.ajax({
        type: "POST",
        processData: false,
        contentType: false,
        url: "http://push.cpl.by/auth/register",
        data:  formData 
      })
      .done(function( data ) {
                       
      });*/
   
     return $http({
          method: 'POST',
          url: "http://push.cpl.by/auth/register", 
          transformRequest: angular.identity,        
          data:  formData ,
          headers: {'Content-Type': undefined}
      })

    }
}]);

