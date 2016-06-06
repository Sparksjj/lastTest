app.controller('GuestbookController', ['$scope', 'authorizationFactory', '$http',"getRequests", "postRequests", "validateForm", "deleteRequest", "$rootScope", "socket", "socetRequest", '$timeout',
	function($scope, authorizationFactory, $http, getRequests, postRequests, validateForm, deleteRequest, $rootScope, socket, socetRequest, timeout) { 
  
  $scope.haveAnswerMessage == "";
  $scope.messages =[];
  $scope.answers =[];

  window.onblur   = function () {$scope.active=false};
  window.onfocus  = function () {$scope.active=true};

  var messSocet = socket.socket('http://push.cpl.by:8890')
  socket.on(messSocet, 'message', function (data) {

    var messageData = angular.fromJson(data);
    
    switch (messageData.action){

      case "comment_added":
        var newMessage = socetRequest.addMessage(messageData, $scope.active); 
        if (newMessage) {
          $scope.messages.data.unshift(newMessage);
        }
      break;

      case "answer_added":      
        if (!$scope.hasAnswer(messageData.answer_id)) {
          $scope.answers.push(messageData.answer);
        };        
      break;

      case "answer_deleted":

        for (var i = $scope.answers.length - 1; i >= 0; i--) {
          if ($scope.answers[i].id == messageData.answer_id) {
            $scope.answers.splice(i, 1);
            return;
          };
        };

      break;

      case "comment_delete":

        for (var i = $scope.messages.data.length - 1; i >= 0; i--) {
          if ($scope.messages.data[i].comment_id == messageData.comment_id) {
            $scope.messages.data.splice(i, 1);
            return;
          };
        };

      break;

    }

  });

  var broadcastSocet = socket.socket('http://push.cpl.by:8890');
  socket.on(broadcastSocet, 'broadcast', function (data) {

    var audio = new Audio();
    audio.src = "wav/vk.mp3";
    audio.autoplay = true;

    var broadcastData = angular.fromJson(data);
    
    var not = noty({
      timeout: 8000,
      layout: 'bottomRight',
      text: broadcastData.text,
      type: 'error',
      closeWith   : ['button'],
      template: '<div class="noty_message flash-color"><a href="'+broadcastData.url+'" target="_blank"><span class="noty_text"></a></span><div class="noty_close"></div></div>',
    });

    timeout(function(not){
      $scope.chengeColor(not)
    }, 5000)
   

  });

$scope.chekMessages = function(url){
  getRequests.getMessages(url).then(function(responce){
    /*север периодически отдает текст ошибки о таймауте запросса*/
       
      if ( responce.data.current_page == 1 ) {
        $scope.messages = responce.data;
        if (responce.data.last_page > 1) {
          $scope.chekMessages(responce.data.next_page_url+'&api_token=UU9quUHYgR84bT1LusQw')
        }
      } else if ( responce.data.current_page != responce.data.last_page) {

          $scope.messages.data = $scope.messages.data.concat(responce.data.data)

        $scope.chekMessages(responce.data.next_page_url+'&api_token=UU9quUHYgR84bT1LusQw')
      }else{
        
        $scope.messages.data = $scope.messages.data.concat(responce.data.data)        

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
      };

    }, function(){
      //do sms an error
  });
}
$scope.chekMessages('http://push.cpl.by/api/v1/comment?api_token=UU9quUHYgR84bT1LusQw')


	
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
        $scope.messages.data.unshift(response.data);

  		  /*$scope.chekMessages() //*/

    		chek.titleForm.find("input").val('')
    		chek.messageForm.find("textarea").val('');
    		chek.form.slideToggle(200);
  		})

    }else if(type == "new-answer" && authorizationFactory.currentUser()){
    	
    	var messId   = chek.form.parent().prev().prev().attr("data-message-id");
  		postRequests.postAnswer({"api_token": authorizationFactory.currentUser().token, "message": chek.messageText}, messId)
  			.then(function(response){

          
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
    var button = $($event.target)
    var id = button.parent().parent().next().attr("data-message-id");
    
    /*chek if message has answer*/
    getRequests.getAnswer(id).then(function(response){
      
      if(response.data.length > 0){
    
        /*true. add flash message or sms*/
        if (!$scope.haveAnswerMessage) {
          $scope.haveAnswerMessage = $("<div class='haveAnswerMessage'>Уже есть ответ</div>");
          $scope.haveAnswerMessage.prependTo(button.parent().parent().parent());
          setTimeout(function(){
            $scope.haveAnswerMessage.remove()
            $scope.haveAnswerMessage = ""
          }, 2000);
        };

      }else{
        deleteRequest.deleteMessage(id, authorizationFactory.currentUser().token).then(function(responce){
        
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
          $scope.chekMessages('http://push.cpl.by/api/v1/comment?api_token=UU9quUHYgR84bT1LusQw')
        });
      };
    });
  }


  $scope.destroyAnswer = function($event){
    var answerId = $($event.target).parent().attr("data-answer-id");
    var messageId = $($event.target).parent().siblings(".message").attr("data-message-id");
    
      deleteRequest.deleteAnswer(messageId, answerId, authorizationFactory.currentUser().token).then(function(responce){

          for (var i = $scope.answers.length - 1; i >= 0; i--) {

            if ($scope.answers[i].id == answerId) {
              $scope.answers.splice(i, 1);
              return;
            };

          };

          /*$scope.chekMessages()*/
        }, function(err){
          /*If sheat hapens refresh data :) */
          $scope.chekMessages('http://push.cpl.by/api/v1/comment?api_token=UU9quUHYgR84bT1LusQw')
      })

  }

  $scope.hasAnswer = function(id){
    for (var i = $scope.answers.length - 1; i >= 0; i--) {
      if ($scope.answers[i].id == id) {
        return true
      }
    }
    return false;
  }

  $scope.isAdmin = authorizationFactory.isAdmin;
  $scope.isSignedIn = authorizationFactory.isSignedIn;
  $scope.itemsPerPage= function(){
    return $scope.messages.per_page;
  }
  $scope.chengeColor = function(not){   
    $("#"+not.options.id).css('background-color', '#ECE9E4');
  }
}]);