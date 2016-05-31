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
      console.log(file);
      console.log(email);
      console.log(password);
      console.log(name);

        var fd = new FormData();
        fd.append('file', file);
        console.log(fd);
        $http({
            method: 'POST',
            url: 'http://push.cpl.by/auth/register',
            
            data: {
              "email": email,
              "password": password,
              "name": name,
              "avatar": file
            },

            transformRequest: angular.identity,
            processData: false,

            headers: {'Content-Type': "multipart/form-data"}
        }).then(function(response){
          console.log(response);
        }, function(err){

        })

    }
}]);

