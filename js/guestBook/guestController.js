app.controller('GuestbookController', ['$scope', 'authorizationFactory', '$http',"getRequests", "postRequests","validateForm",
	function($scope, authorizationFactory, $http, getRequests, postRequests, validateForm) { 
  
  $scope.users =[];
  $scope.messages =[];
  $scope.answers =[];
  $scope.timestamp = {
    messages: 0,
    answers: 0
  }

getRequests.getUsers().then(function(responce){
      $scope.users = responce.data;
    }, function(){
      //do sms an error
});  

/*проверяем метку времени на сервере, если не совпадает => файл изменен обновляем*/
$scope.chekMessages = function(){
  getRequests.getMessages($scope.timestamp.messages).then(function(responce){
    /*север периодически отдает текст ошибки о таймауте запросса*/
    try{    
      var ss = responce.data.slice(1, -10);
      $scope.messages = JSON.parse(ss); 
      $scope.timestamp.messages = responce.data.substr(-10);
      $scope.chekMessages();
    }catch(e){      
      $scope.chekMessages();
    }

    }, function(){
      //do sms an error
  });

}
$scope.chekMessages()

/*проверяем метку времени на сервере, если не совпадает => файл изменен обновляем*/
$scope.chekAnswers = function(){
  getRequests.getAnswers($scope.timestamp.answers).then(function(responce){
    /*север периодически отдает ошибку о таймаут запросса*/
      try{
        var ss = responce.data.slice(1, -10);
        $scope.answers = JSON.parse(ss);
        $scope.timestamp.answers = responce.data.substr(-10);  
        $scope.chekAnswers($scope.timestamp.answers);
      }catch(e){        
        $scope.chekMessages();
      }


      }, function(){
        //do sms an error
  });
} 
$scope.chekAnswers()
	

  $scope.sendNewMessage = function($event , type){

    var chek = validateForm.validateMessAnsw($event) //return false if invalid or mess/answ obj data

  	if (!chek){
      return
    };

    if (type == "new-mess" && authorizationFactory.currentUser()) {
    	var messagesId= ($scope.messages[$scope.messages.length-1].id +1);
      
  		postRequests.post({"id": messagesId, "userId": authorizationFactory.currentUser().id, "title": chek.titleText, "mess": chek.messageText})
  			.success(function(data, status, headers, config){

  			$scope.messages = data;

    		chek.titleForm.find("input").val('')
    		chek.messageForm.find("textarea").val('');
    		chek.form.slideToggle(200);

  		})

    }else if(type == "new-answer" && authorizationFactory.currentUser()){
    	var answerId = $scope.answers[$scope.answers.length-1].id +1;
    	var messId   = chek.form.parent().prev(".message").attr("data-message-id");
      
  		postRequests.post({"id": answerId, "messId": messId, "userId": authorizationFactory.currentUser().id, "title": chek.titleText, "mess": chek.messageText})
  			.success(function(data, status, headers, config){

        $scope.answers = data; 

    		chek.titleForm.find("input").val('')
    		chek.messageForm.find("textarea").val('');
    		chek.form.slideToggle(200);
  		})

    };

  }


  $scope.answer =   function(mess){
    var answer;
    $scope.answers.forEach(function(item){
      if (item.messId == mess.id && !answer){
        answer = item;
      } 
    })
    return answer;
  };


  $scope.showForm = function($event){
  	var button = $event.target;
  	$(button).prev().slideToggle(200);
  };

  $scope.isAdmin = authorizationFactory.isAdmin;
  $scope.isSignedIn = authorizationFactory.isSignedIn;
}]);