app.controller('loginCtrl', ['$scope', 'authorizationFactory', 'validateSignIn', '$rootScope', 'fileUpload',
function($scope, authorizationFactory, validateSignIn, $rootScope, fileUpload){
  $scope.formInfo = {
    email: "",
    password: ""
  } 

$('input[type=file]').change(function(){
    $scope.file = this.files[0];
});

  $scope.loginClick = function($event) {

    if(!validateSignIn.chekUserInput($event, $scope.formInfo.email, $scope.formInfo.password, "заполните пустые поля")){
      return;
    };

    authorizationFactory.login($scope.formInfo.email, $scope.formInfo.password)

  }

  $scope.chek = function(){

      var file = $scope.myFile;
      console.log('file is ' );
      console.dir(file);
      var uploadUrl = "/fileUpload";/*
      console.log($scope.formInfo['new-email']);
      console.log($scope.formInfo['new-password']);
      console.log($scope.formInfo['new-name']);
*/
      fileUpload.uploadFileToUrl(file, $scope.formInfo['new-email'], $scope.formInfo['new-password'], $scope.formInfo['new-name']);
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