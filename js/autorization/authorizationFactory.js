app.factory('authorizationFactory',['$userProvider', '$http', 'validateSignIn', '$rootScope',
  function($userProvider, $http, validateSignIn, $rootScope){
   
    var login = function(login, pass, $event){

      $http({
        method: 'POST',
        url: 'http://push.cpl.by/auth/login',
        data: {'email': login, 'password': pass}
      }).then(function(response){

        
        if (response.data.is_admin == 1) {
            $userProvider.setUser({avatar: response.data.avatar, id: response.data.id, name: response.data.name, email: response.data.email, roles: $userProvider.rolesEnum.admin, token: response.data.api_token});
          }else{
            $userProvider.setUser({avatar: response.data.avatar, id: response.data.id, name: response.data.name, email: response.data.email, roles: $userProvider.rolesEnum.user, token: response.data.api_token});
          };
          $rootScope.$emit('rootScope.signInSuccess');

      }, function(err){
        validateSignIn.chekUserInput($event, '', '', "Неверный логин или пароль")
      })
      
    }   

    var loginNewUser = function(data){
        
        if (data.is_admin == 1) {
          console.log("ad");
            $userProvider.setUser({id: data.id, login: data.name, email: data.email, roles: $userProvider.rolesEnum.admin, token: data.api_token});
          }else{
            console.log("us");
            $userProvider.setUser({id: data.id, login: data.name, email: data.email, roles: $userProvider.rolesEnum.user, token: data.api_token});
          };
          $rootScope.$emit('rootScope.signInSuccess');

    }

    var logOut = function(){
      localStorage.removeItem('currentUser');
    }

    var isAdmin = function(){

      var user = $userProvider.getUser()

      if(user){
        if ( user.roles == 0) {
          return true;
        };
      }

      return false;
    }

    var isSignedIn = function(){
   
      if( localStorage.getItem('currentUser') ){
        return true;
      }
      return false;
    }
    
    var currentUser = function(){
      return $userProvider.getUser();
    }

    var sayHi = function(){
      if (currentUser()) {
        return 'Добро пожаловать ' + currentUser().email;
      }else{
        return "";
      }      
    }

    return {
      login:        login,
      logOut:       logOut,
      isAdmin:      isAdmin,
      isSignedIn:   isSignedIn,
      currentUser:  currentUser,
      sayHi:        sayHi,
      loginNewUser: loginNewUser
    }

}]);