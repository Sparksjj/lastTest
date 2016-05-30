/*for validation mess/answ forms*/
app.factory("validateForm", function(){

  var validateMessAnsw = function($event){

    var button      = $event.target;
    var form      = $(button).parent();

    var titleForm     = form.find("div.form-group").eq(0);
    var titleText     = titleForm.find("input").val();

    var messageForm   = form.find("div.form-group").eq(1);
    var messageText   = messageForm.find("textarea").val();

    var titleError    = form.find('div.title-error');
    var messageError  = form.find('div.message-error');

    if (titleText.length < 3) {
      titleForm.addClass("has-error");

      if (titleError.length == 0) {
        $("<div class='error title-error'>Заголовок должен быть больше 3 символов</div>").prependTo(form);
      };

    }else{
      titleForm.removeClass("has-error");
      titleError.remove();
    };

    if (messageText.length  < 10) {
      messageForm.addClass("has-error");

      if (messageError.length == 0) {
        $("<div class='error message-error'>Сообщение должно быть больше 10 символов</div>").prependTo(form);
      };

    }else{
      messageForm.removeClass("has-error");
      messageError.remove();
    };

    if (titleForm.hasClass("has-error") || messageForm.hasClass("has-error")) {
      return false;
    }

      return {
        "form": form,
        "titleForm": titleForm,
        "titleText": titleText,
        "messageForm": messageForm,
        "messageText": messageText,
      }

  }

  return {
    validateMessAnsw: validateMessAnsw,
  };

})