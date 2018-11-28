$('.switchAnalizar').on("click", function(event){
  event.preventDefault();
  console.log("entro");

  //Poner highlighted solo el boton seleccionado (Twitter o ensayo)
  $('.switchAnalizar').removeClass('selectedAnalysis');
  $(this).addClass('selectedAnalysis');

  //esconder todas las secciones (para luego solo habilitar la seleccionada)
  $('.selectDiv').addClass('hide');

  //Quitar las verificaciones de campos de todas las secciones
  $(this).parent().attr('onsubmit', "");
  $("div#twitter input").prop('required', false);

  if($(this).attr('id') == 'ensayoSelect'){
    //mostrar la seccion de ensayo
    $('#ensayo').removeClass('hide');

    // Poner el action correspondiente
    //  $(this).parent().attr('action', '/PIServiceEssay');

    //Agregar las validaciones necesarias para el ensayo
    $(this).parent().attr('onsubmit', "checkformEssay(event)");

  }else{
    //mostrar la seccion de twitter
    $('#twitter').removeClass('hide');

    // Poner el action correspondiente
    //  $(this).parent().attr('action', '/PIServiceTwitter');

    //Agregar las validaciones necesarias para twitter
    $("div#twitter input").prop('required',true);
  }

});
