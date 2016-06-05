app.factory("socetRequest", ['authorizationFactory', function(authorizationFactory, active){

  var addMessage = function(data, active){
      
      var userId = data.comment.user_id

      if (userId != authorizationFactory.currentUser().id || !active) {
        var newData = data.comment;
        newData.user = data.user;
        newData.comment_id = data.comment.id;
        return newData;
      }

      return false;

  }  


  return {
    addMessage: addMessage,
  };

}])