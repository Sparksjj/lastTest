app.directive('newMessage', function() { 
  return { 

    restrict: 'E', 
    scope: true, 
    templateUrl: 'js/guestBook/layouts/newMessage.html',

  }; 
});