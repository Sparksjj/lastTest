app.factory('validateSignIn', function(){
	  
	var chekUserInput = function($event, login, password, mess){
		var errorMessage = $("#error-message");
		var emailInput 	= $("#inputEmail");
		var passwordlInput 	= $("#inputPassword");
		var success = true;

		if (login.length == 0){
			emailInput.addClass("has-error");
			success = false;
		}else{
			emailInput.removeClass("has-error");
		}
		
		if (password.length == 0){
			passwordlInput.addClass("has-error");
			success = false;
		}else{
			passwordlInput.removeClass("has-error");
		}

		if (success) {			
			errorMessage.text("");
			return true;
		}else{			
			errorMessage.text(mess);
			return false;
		}
	}

	var	calearData = function(){

		$("#error-message").text("");
		$("#inputEmail").removeClass("has-error");
		$("#inputPassword").removeClass("has-error");
		
	}

	var	validatNewUser = function(email, password, name, file){
		if(email != "" && password != "" && name != ""){
			return false;
		}
		return true;	
	}

	var	chekFile = function(file){
		allowFormats = ["image/jpeg", "image/bpn", "image/png"];

/*    console.log(allowFormats.indexOf($scope.file.type));*/
    	if (!file) {
    	  return "Выберите файл (jpeg,bmp,png)";
    	}else{
    	  if (allowFormats.indexOf(file.type) == -1) {
    	    return "Не верный формат выберите jpeg, bmp, png";
    	    
    	  };
    	  return false
    	};	
	}

	return {
		chekUserInput: chekUserInput,
		calearData: calearData,
		validatNewUser: validatNewUser,
		chekFile: chekFile
	};
});