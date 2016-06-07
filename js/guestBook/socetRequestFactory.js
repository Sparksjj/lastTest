app.factory("socetRequest", ['authorizationFactory', function(authorizationFactory, active){

  var addMessage = function(data){



        var newData = data.comment;
        newData.user = data.user;
        newData.comment_id = data.comment.id;
        return newData;


  }  


  return {
    addMessage: addMessage,
  };

}])