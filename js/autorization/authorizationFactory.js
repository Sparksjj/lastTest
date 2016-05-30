app.factory('authorizationFactory',['$userProvider', '$http', 'validateSignIn', '$rootScope',
  function($userProvider, $http, validateSignIn, $rootScope){
   
    var login = function(login, pass, $event){

      $http.get('easy-serv.php?email='+login+'&password='+pass).success(function(data, status, headers, config){
        
        if (data != '') {
          data = JSON.parse("{"+data+"}");
          if (data.admin) {
            $userProvider.setUser({id: data.id, login: data.name, email: data.email, roles: $userProvider.rolesEnum.admin});
          }else{
            $userProvider.setUser({id: data.id, login: data.name, email: data.email, roles: $userProvider.rolesEnum.user});
          };
          $rootScope.$emit('rootScope.signInSuccess');
          
        }else{

          validateSignIn.chekUserInput($event, '', '', "Неверный логин или пароль")
        }
        
      })
 
 
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
      sayHi:        sayHi
    }

}]);