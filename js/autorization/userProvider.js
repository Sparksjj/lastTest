app.factory('$userProvider', function(){
  
  var rolesEnum = {
    admin: 0,
    user: 1,
  };

  var setUser = function(u){
    localStorage.setItem('currentUser', angular.toJson(u));
  }

  var getUser = function(){
    if (localStorage.getItem('currentUser')) {
      return JSON.parse(localStorage.getItem('currentUser'))
    }
    return false;
  }
 
  return {
    getUser: getUser,
    setUser: setUser,
    rolesEnum: rolesEnum,
  }
});