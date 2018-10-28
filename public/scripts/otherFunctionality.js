$(document).ready(function()
{

    $("#textarea2").change(function (){
      console.log("Cambiaste el texto");
      $(".hiddendiv.common").remove();
                                       });

    var emailCookie = getCookie("email");
    var failedTwitterAccount = getCookie('failedTwitterAccount');
    var tweetsLang = getCookie('tweetsLang');
    var somethingWrong = getCookie('somethingWrong');

    console.log("email cookie: " + emailCookie);
    //alert("email cookie: " + emailCookie);
    var emailElement = document.getElementById("email");
    emailElement.innerHTML = emailCookie;

    if (failedTwitterAccount != ""){

        var lang;

        if (tweetsLang == "en")
            lang = "ingles"
        else if (tweetsLang == "es")
            lang = "español"

        alert("La cuenta de twitter " + failedTwitterAccount + " no posee suficientes tweets en " + lang + " para ser analizados");

        document.cookie = 'failedTwitterAccount' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'tweetsLang' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    } else if (somethingWrong != ""){

        alert("La cuenta de twitter " + somethingWrong + " no pudo ser analizada debido a que no existe, o bien, se trata de una cuenta privada.");
        document.cookie = 'somethingWrong' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    }


});


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
