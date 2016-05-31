var app = angular.module("myApp", ['ngRoute', 'angularUtils.directives.dirPagination', 'angularFileUpload']);

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

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, email, password, name){

        var formData = new FormData();
        formData.append("avatar", file)
        formData.append("email", email)
        formData.append("name", name)
        formData.append("password", password)

      $.ajax({
        type: "POST",
        processData: false,
        contentType: false,
        url: "http://push.cpl.by/auth/register",
        data:  formData 
      })
      .done(function( data ) {
                       
      });
   
/*        $http({
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            url: 'http://push.cpl.by/auth/register',
          
            data: {
              filee: file
            },
            
        }).then(function(response){
          console.log(response);
        }, function(err){

        })*/

    }
}]);

