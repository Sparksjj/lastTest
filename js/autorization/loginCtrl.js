app.controller('loginCtrl', ['$scope', 'authorizationFactory', 'validateSignIn', '$rootScope', 
function($scope, authorizationFactory, validateSignIn, $rootScope){
  $scope.formInfo = {
    email: "",
    password: ""
  } 

  $scope.newUser = {
    email: "",
    password: "",
    name: ""
  } 

  $scope.file;  

/*add file*/
  $("input[type='file']").change(function(){
    $scope.file = this.files[0];
  })


/*add validate-message for new user*/
  $scope.showError = function(ngModelController, error) {
    return ngModelController.$error[error];
  };


  $scope.loginClick = function($event) {

    if(!validateSignIn.chekUserInput($event, $scope.formInfo.email, $scope.formInfo.password, "заполните пустые поля")){
      return;
    };

    authorizationFactory.login($scope.formInfo.email, $scope.formInfo.password)

  }

  $scope.createNewUser = function(){

   if ($scope.newUserForm.$invalid) {
    return;
   }else{
    var fileMessage = validateSignIn.chekFile($scope.file)
    if (fileMessage) {
      $scope.errorFileMess = fileMessage;
      return;
    };
    $scope.errorFileMess = "";
   }; 

    authorizationFactory.sendNewUser($scope.file, $scope.newUser['email'], $scope.newUser['password'], $scope.newUser['name']).then(function(res){

      authorizationFactory.loginNewUser(res.data)
      
      $scope.newUser = {
        email: "",
        password: "",
        name: ""
      } 
    $("input[type='file']")[0].value="";

    }, function(err){

      $scope.serverError = "Пользовaтель с таким email уже существует";
      $scope.newUser.email =""
      $scope.newUser.password =""
      
    });

  }

  $scope.logOutClick = function($event){
    authorizationFactory.logOut();    
  }


  $scope.isAdmin = authorizationFactory.isAdmin;
  $scope.isSignedIn = authorizationFactory.isSignedIn;
  $scope.hiMessage = authorizationFactory.sayHi();
  $scope.currentUser = authorizationFactory.currentUser();

/*событие при успешной авторизации*/
  $rootScope.$on('rootScope.signInSuccess', function() {
    /*clear error messages and classes*/
      validateSignIn.calearData();

      $scope.formInfo = {
        email: "",
        password: ""
      }
      /*clear modal window and add hi message*/
      $scope.currentUser = authorizationFactory.currentUser();
      $('button.close').trigger('click');
      $scope.hiMessage = authorizationFactory.sayHi();
  });


}]);