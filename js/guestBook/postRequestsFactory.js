/*for post requests*/
app.factory("postRequests", function($http){

  var postRequestsMess = {
    postMessage: function(messData){
    	
      return $http({
      	method: "POST",
      	url: 'http://push.cpl.by/api/v1/comment',
      	data: messData
      })
    },

    postAnswer: function(answerData, messId){
    	console.log(messId);
      return $http({
      	method: "POST",
      	url: 'http://push.cpl.by/api/v1/comment/'+messId+'/answer',
      	data: answerData
      })
    },
  }

  return postRequestsMess;

})