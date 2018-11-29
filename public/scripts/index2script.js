
$('.switchAnalizar').on("click", function(event){
  event.preventDefault();
  console.log("entro");

  //Poner highlighted solo el boton seleccionado (Twitter o ensayo)
  $('.switchAnalizar').removeClass('selectedAnalysis');
  $(this).addClass('selectedAnalysis');

  //esconder todas las secciones (para luego solo habilitar la seleccionada)
  $('.selectDiv').addClass('hide');

  //Quitar las verificaciones de campos de todas las secciones
  $('#formAnalysis').attr('onsubmit', "");
  $("div#twitter input").prop('required', false);

  if($(this).attr('id') == 'ensayoSelect'){
    //mostrar la seccion de ensayo
    $('#ensayo').removeClass('hide');

    //Agregar las validaciones necesarias para el ensayo
    $('#formAnalysis').attr('onsubmit', "checkformEssay(event)");

  }else{
    //mostrar la seccion de twitter
    $('#twitter').removeClass('hide');

    //Agregar las validaciones necesarias para twitter
    $('#formAnalysis').attr('onsubmit', "checkformTwitter(event)");
  //  $("div#twitter input").prop('required',true);
  }

});
