/*for gets requests*/
app.factory("getRequests", function($http){

  var getRequests = {


    getUsers: function(Scallback, Ecallback){
      return $http.get('data/users.json').then(Scallback, Ecallback);
    },

    getMessages: function(url){
      return  $http({
                method: 'GET',
                url: url,
                data: {'api_token': 'UU9quUHYgR84bT1LusQw'}
              })
    },
    getAnswer: function(id){
      return  $http({
            method: 'GET',
            url: 'http://push.cpl.by/api/v1/comment/'+id+'/answer?api_token=UU9quUHYgR84bT1LusQw',
            data: {'api_token': 'UU9quUHYgR84bT1LusQw'}
          })
    },


/*
    getUsers: $http.get('data/users.json').success(function(data, status, headers, config){
      return data;
      }),

    getAnswers: $http.get('data/answers.json').success(function(data, status, headers, config){
      return data;
      }),

    getMessages: $http.get('data/messages.json').success(function(data, status, headers, config){
      return data;
      })*/

  }



  return getRequests;

})