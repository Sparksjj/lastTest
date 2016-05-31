app.controller('GuestbookController', ['$scope', 'authorizationFactory', '$http',"getRequests", "postRequests","validateForm", "deleteRequest",
	function($scope, authorizationFactory, $http, getRequests, postRequests, validateForm, deleteRequest) { 
  

  $scope.messages =[];
  $scope.answers =[];
  $scope.timestamp = {
    messages: 0,
    answers: 0
  }


 $http({
  method: 'GET',
  url: 'http://push.cpl.by/api/v1/comment/2/answer?api_token=UU9quUHYgR84bT1LusQw',
  data: {'api_token': 'UU9quUHYgR84bT1LusQw'}
}).then(function(responce){
      console.log(responce.data);
    }, function(){
      //do sms an error
});  




getRequests.getUsers().then(function(responce){
      $scope.users = responce.data;
    }, function(){
      //do sms an error
});  


$scope.chekMessages = function(){
  getRequests.getMessages($scope.timestamp.messages).then(function(responce){
    /*север периодически отдает текст ошибки о таймауте запросса*/
    try{    
      
      $scope.messages = responce.data; 

      $scope.messages.data.forEach(function(elem){

         getRequests.getAnswer(elem.comment_id).then(function(responce){

                if(responce.data[0]) {
                  $scope.answers.push(responce.data[0])
                };
              }, function(){
                //do sms an error
          })
      })
      $scope.answers =[];
    }catch(e){      
      /*$scope.chekMessages();*/
    }

    }, function(){
      //do sms an error
  });

}
$scope.chekMessages()

/*проверяем метку времени на сервере, если не совпадает => файл изменен обновляем*/

	

  $scope.sendNewMessage = function($event , type){
console.log(type);
    var chek = validateForm.validateMessAnsw($event, type) //return false if invalid or mess/answ obj data

  	if (!chek){
      return
    };

    if (type == "new-mess" && authorizationFactory.currentUser()) {    	
      
  		postRequests.postMessage({"title": chek.titleText, "message": chek.messageText, "api_token": authorizationFactory.currentUser().token})
  			.then(function(response){

  			$scope.chekMessages()

    		chek.titleForm.find("input").val('')
    		chek.messageForm.find("textarea").val('');
    		chek.form.slideToggle(200);
  		})

    }else if(type == "new-answer" && authorizationFactory.currentUser()){
    	
    	var messId   = chek.form.parent().prev().prev().attr("data-message-id");
  		postRequests.postAnswer({"api_token": authorizationFactory.currentUser().token, "message": chek.messageText}, messId)
  			.then(function(response){
          $scope.chekMessages()
  		}, function(err){

      })

    };

  }


  $scope.answer =   function(mess){
    var answer;
    $scope.answers.forEach(function(item){
      if (item.comment_id == mess.comment_id && !answer){
        answer = item;
      } 
    })
    return answer;
  };


  $scope.showForm = function($event){
  	var button = $event.target;
  	$(button).prev().slideToggle(200);
  };


  $scope.isItMy = function(messId){
    if (messId == authorizationFactory.currentUser().id) {
      return true;
    };
    return false
  }

  $scope.destroyMess = function($event){
    var button = $($event)
    var id = $($event.target).parent().parent().next().attr("data-message-id");
    
    getRequests.getAnswer(id).then(function(response){
      
      if(response.data.length > 0){
        var i = 0;



      }else{
        deleteRequest.deleteMessage(id, authorizationFactory.currentUser().token).then(function(responce){
          $scope.chekMessages()
        }, function(err){

        })
      };
    })


/*    deleteRequest.deleteMessage(id, authorizationFactory.currentUser().token).then(function(responce){

    }, function(err){

    })*/
  }


  $scope.destroyAnswer = function($event){
    var answerId = $($event.target).parent().attr("data-answer-id");
    var messageId = $($event.target).parent().siblings(".message").attr("data-message-id");
    
      deleteRequest.deleteAnswer(messageId, answerId, authorizationFactory.currentUser().token).then(function(responce){
          $scope.chekMessages()
        }, function(err){

      })

  }


  $scope.hasAnswer = function(){
    if (true) {};
  }

  $scope.isAdmin = authorizationFactory.isAdmin;
  $scope.isSignedIn = authorizationFactory.isSignedIn;
}]);