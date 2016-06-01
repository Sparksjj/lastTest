app.controller('GuestbookController', ['$scope', 'authorizationFactory', '$http',"getRequests", "postRequests", "validateForm", "deleteRequest",
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


	
/*send message and answer*/
  $scope.sendNewMessage = function($event , type){

    var chek = validateForm.validateMessAnsw($event, type) //return false if invalid or mess/answ obj data

  	if (!chek){
      return
    };

    if (type == "new-mess" && authorizationFactory.currentUser()) {    	
      
  		postRequests.postMessage({"title": chek.titleText, "message": chek.messageText, "api_token": authorizationFactory.currentUser().token})
  			.then(function(response){
          
        /*compile corrent data*/
        var data = response.data;
        data.user = authorizationFactory.currentUser();
        data.comment_id = data.id;

        /*add message*/
        $scope.messages.data.push(response.data);

  		  /*$scope.chekMessages() //*/

    		chek.titleForm.find("input").val('')
    		chek.messageForm.find("textarea").val('');
    		chek.form.slideToggle(200);
  		})

    }else if(type == "new-answer" && authorizationFactory.currentUser()){
    	
    	var messId   = chek.form.parent().prev().prev().attr("data-message-id");
  		postRequests.postAnswer({"api_token": authorizationFactory.currentUser().token, "message": chek.messageText}, messId)
  			.then(function(response){

          $scope.answers.push(response.data);
          /*$scope.chekMessages()*/
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
    
    /*chek if message has answer*/
    getRequests.getAnswer(id).then(function(response){
      
      if(response.data.length > 0){
    
        /*true. add flash message or sms*/


      }else{
        deleteRequest.deleteMessage(id, authorizationFactory.currentUser().token).then(function(responce){
          console.log($scope.messages);

          /*false. delete message from messages.data*/
          for (var i = $scope.messages.data.length - 1; i >= 0; i--) {

            if ($scope.messages.data[i].comment_id == id) {
              $scope.messages.data.splice(i, 1);
              return;
            };

          };

         /* $scope.chekMessages()*/
        }, function(err){
          /*if error its mean user doesn't refresh page for a long time and admin send message*/
          /*refrehs data*/
          $scope.chekMessages()
        });
      };
    });
  }


  $scope.destroyAnswer = function($event){
    var answerId = $($event.target).parent().attr("data-answer-id");
    var messageId = $($event.target).parent().siblings(".message").attr("data-message-id");
    
      deleteRequest.deleteAnswer(messageId, answerId, authorizationFactory.currentUser().token).then(function(responce){

          console.log($scope.answers);
          for (var i = $scope.answers.length - 1; i >= 0; i--) {

            if ($scope.answers[i].id == answerId) {
              $scope.answers.splice(i, 1);
              return;
            };

          };

          /*$scope.chekMessages()*/
        }, function(err){
          /*If sheat hapens refresh data :) */
          $scope.chekMessages()
      })

  }


  $scope.hasAnswer = function(){
    if (true) {};
  }

  $scope.isAdmin = authorizationFactory.isAdmin;
  $scope.isSignedIn = authorizationFactory.isSignedIn;
}]);