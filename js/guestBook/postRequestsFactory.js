/*for post requests*/
app.factory("postRequests", function($http){

  var postRequests = {
    post: function(data){
      return $http.post('easy-serv.php', data).success(function(data, status, headers, config){
                data;
              })
    }
  }

  return postRequests;

})