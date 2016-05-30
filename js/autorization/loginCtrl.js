app.controller('loginCtrl', ['$scope', 'authorizationFactory', 'validateSignIn', '$rootScope',
function($scope, authorizationFactory, validateSignIn, $rootScope){
  $scope.formInfo = {
    email: "",
    password: ""
  } 

  $scope.loginClick = function($event) {

    if(!validateSignIn.chekUserInput($event, $scope.formInfo.email, $scope.formInfo.password, "заполните пустые поля")){
      return;
    };

    authorizationFactory.login($scope.formInfo.email, $scope.formInfo.password)

  }

  $scope.chek = function(){
    console.log($scope.formInfo['new-password'])
    console.log($scope.formInfo['new-name'])
    console.log($scope.formInfo['new-email'])
    console.log($scope.formInfo['new-file'])
  }

  $scope.logOutClick = function($event){
    authorizationFactory.logOut();    
  }

  $scope.isAdmin = authorizationFactory.isAdmin;
  $scope.isSignedIn = authorizationFactory.isSignedIn;
  $scope.currentUser = authorizationFactory.currentUser();
  $scope.hiMessage = authorizationFactory.sayHi();

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