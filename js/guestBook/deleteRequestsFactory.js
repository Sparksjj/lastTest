/*for delete requests*/
app.factory("deleteRequest", function($http){

  var deleteRequest = {
    deleteMessage: function(id, token){
    	
      return $http({
      	method: "DELETE",
      	url: 'http://push.cpl.by/api/v1/comment/'+id+'?api_token='+token,
      	data: {
      		"api_token": token
      	}
      })
    },

    deleteAnswer: function(messageId, answerId, token){
    	
      return $http({
      	method: "DELETE",
      	url: 'http://push.cpl.by/api/v1/comment/'+messageId+'/answer/'+answerId+'?api_token='+token,
      	data: {
      		"api_token": token
      	}
      })
    },
  }

  return deleteRequest;

})