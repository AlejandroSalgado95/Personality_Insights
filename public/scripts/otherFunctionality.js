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

//Descargar reporte como pdf
$('#descPDF').on("click", function(event){
  event.preventDefault();
  console.log("entro a descargar");

  //PARA IMPRIMIR TODO EL BODY PERO NO TE SALEN LAS HIGHCHARTS
  // let doc = new jsPDF();
  //
  // doc.addHTML(document.body, function(){
  //   doc.save('Reporte_Del_Analisis.pdf');
  // });

  // var canvas = $("#container3 .highcharts-container svg.hicharts-root").get(0);
  // var dataURL = canvas.toDataURL();
  //
  // var pdf = new jsPDF();
  //   pdf.addImage(dataURL, 'JPEG', 0, 0);
  //   pdf.save("download.pdf");


  //save_chart($('#container3').highcharts());

  var chart = $('#container3').highcharts();

  var render_width = 1000;
  var render_height = render_width * chart.chartHeight / 	chart.chartWidth

  // Get the cart's SVG code
  var svg = chart.getSVG({
      exporting: {
          sourceWidth: chart.chartWidth,
          sourceHeight: chart.chartHeight
      }
  });

  // Create a canvas
  var canvas = document.createElement('canvas');
  canvas.height = render_height;
  canvas.width = render_width;
//  document.body.appendChild(canvas);

  // Create an image and draw the SVG onto the canvas
  var image = new Image;
  image.onload = function() {
      canvas.getContext('2d').drawImage(this, 0, 0, render_width, render_height);
  };
  image.src = 'data:image/svg+xml;base64,' + window.btoa(svg);

  var data = canvas.toDataURL("image/png");

  console.log(data);

  var doc = new jsPDF('p', 'pt', 'a4');
  doc.addImage(data, 'PNG', 40, 40, 75, 75);
  //doc.save('test.pdf');

});

//convertir svg de highcharts a canvas para poderlo descargar con jsPDF
function save_chart(chart) {
    var render_width = 1000;
    var render_height = render_width * chart.chartHeight / 	chart.chartWidth

    // Get the cart's SVG code
    var svg = chart.getSVG({
        exporting: {
            sourceWidth: chart.chartWidth,
            sourceHeight: chart.chartHeight
        }
    });

    // Create a canvas
    var canvas = document.createElement('canvas');
    canvas.height = render_height;
    canvas.width = render_width;
    document.body.appendChild(canvas);

    // Create an image and draw the SVG onto the canvas
    var image = new Image;
    image.onload = function() {
        canvas.getContext('2d').drawImage(this, 0, 0, render_width, render_height);
    };
    image.src = 'data:image/svg+xml;base64,' + window.btoa(svg);
}



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
