app.directive('message', function() { 
  return { 

    restrict: 'E', 
    scope: true, 
    templateUrl: 'js/guestBook/layouts/message.html',

    link: function($scope, element, attr){
    	$scope.user = findUser();
      attr.$observe('$scope.message', function(value) {
          console.log(123);
      })

      function findUser(){
        var user;
        $scope.users.forEach(function(item){
          if (item.id == $scope.mess.userId && !user){
            user = item;
          } 
        })
        return user;
      };  
          


  	}

  }; 
});