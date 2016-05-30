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

	return {
		chekUserInput: chekUserInput,
		calearData: calearData
	};
});