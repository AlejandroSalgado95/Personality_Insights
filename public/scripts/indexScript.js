
//AJAX para obtener el ultimo json completo de la personalidad
$.ajax({

          url: "/FullReportJson",
          cache : true,
          type : "POST",
          crossDomain: true,
          dataType : "json",

          error : function(errorMessage, textStatus, errorThrown) {
              console.log(errorMessage);
              console.log(textStatus);
              console.log(errorThrown);
              console.log("EL AJAX RECIBIO ERROR");

              //Ahorita como no se guarda todo en la base de datos,
              $.ajax({

                      url: "/LastProfile",
                      cache : true,
                      type : "POST",
                      crossDomain: true,
                      dataType : "json",

                      error : function(errorMessage, textStatus, errorThrown) {
                          console.log(errorMessage);
                          console.log(textStatus);
                          console.log(errorThrown);
                      },

                      success: function(dataReceived){
                        downloadJSON(dataReceived);
                      }
              });

          },

          success: function(dataReceived){
            console.log("Entro a success");
            console.log(dataReceived);

            downloadJSON(dataReceived);

            //para descargar csv
            // $('<a href="data:' + data + '" download="data.csv" style="margin-bottom:16px; font-size:14px;" class="deep-purple darken-1 btn" >Download CSV</a>').appendTo('#botones');
          }
});

//habilitar boton de descargar JSON
function downloadJSON(dataReceived){
  //para descargar el json
  var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataReceived));
  $('<a href="data:' + data + '" download="data.json" style="margin-bottom:16px; font-size:14px;" class="deep-purple darken-1 btn" >Descargar JSON</a>').appendTo('#botones');
}

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
