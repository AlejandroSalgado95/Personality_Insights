
    var ctx = document.getElementById("myChart").getContext('2d');

    var openness;
    var conscientiousness;
    var extraversion;
    var agreeableness;
    var emotionalRange;

    // top1 = 0;
    // top2 = 0;
    // var high1 = 0;
    // var high2 = 0;
    //
    // // Separa las posiciones del mas grande y segundo mas grande
    // //top1 tiene el big_5 que se aleja mas del punto medio (sea percentile grande o chico)
    // //top2 tiene el segundo que mas se aleja
    //   for (var i = 0; i < big5Array.length; i++) {
    //     if (big5Array[i] > high1) {
    //       high2 = high1;
    // 	top2 = top1;
    //       high1 = big5Array[i];
    // 	top1 = i;
    //     } else if (big5Array[i] > high2) {
    //       high2 = big5Array[i];
    // 	top2 = i;
    //     }
    //   }
    //
    //   // 0 = H-H,  1 = H-L, 2 = L-H,  3 = L-L


    var valores = {
      "value_conservation" :
      {
        "muyBajo": "Te importa más seguir tu propio camino que seguir las tradiciones.",
        "bajo": "No te motivan mucho las tradiciones, sigues más tu propio camino que el de otros.",
        "alto": "Tienes cierto respeto hacia las tradiciones y hacia los grupos a los que perteneces.",
        "muyAlto": "Tienes mucho respeto hacia las tradiciones y hacia los grupos a los que perteneces, por lo que generalmente sigues su guía."
      },
      "value_openness_to_change":
      {
        "muyBajo": "Recibes de buena manera que otras personas dirigan tus actividades.",
        "bajo": "No te molesta que otras personas dirijan tus actividades." ,
        "alto": "Prefieres establecer tus propias metas y dirigir tus actividades en vez de que otras personas lo hagan.",
        "muyAlto": "Te gusta establecer tus propias metas para decidir cómo alcanzarlas mejor."
      },
      "value_hedonism": {
        "muyBajo": "Te motivan las actividades que tengan un propósito más grande que el simple deleite personal.",
        "bajo": "Prefieres actividades con un propósito más grande que el simple deleite personal." ,
        "alto": "Te gusta realizar actividades por deleite personal sin que tengan ningún propósito especial.",
        "muyAlto": "Tienes gran motivación por disfrutar la vida en su plenitud."
      },
      "value_self_enhancement":
      {
        "muyBajo": "Generalmente tomas decisiones sin considerar cómo muestran tus talentos.",
        "bajo": "A veces tomas decisiones sin considerar cómo muestran tus talentos.",
        "alto": "Tienes cierta motivación para mejorarte a ti mismo y desmostrar que eres una persona capaz.",
        "muyAlto": "Buscas oportunidades para mejorarte a ti mismo y para demostrar que eres una persona capaz."
      },
      "value_self_transcendence": {
        "muyBajo": "Crees que las personas pueden encargarse de sus propios asuntos sin ayuda.",
        "bajo": "A veces consideras que las personas pueden encargarse de sus propios asuntos sin ayuda.",
        "alto": "Consideras algo importante cuidar de las personas que te rodean.",
        "muyAlto": "Crees que es importante cuidar de las personas que te rodean."
      }
    };

    var myArrF = [
    [ // Cordialidad/Amabilidad //
        [ // Cordialidad/Amabilidad //
            "N/A", // High-High //
            "N/A", // High-Low //
            "N/A", // Low-High //
            "N/A"  // Low-Low //
        ],
        [ // Responsabilidad //
            "Tiendes a ser una persona responsable, considerada, y algo dependiente.", // High-High // responsable, de confianza, educado, considerado
            "Tiendes a ser una persona modesta.", // High-Low //
            "Tiendes a ser una persona estricta y firme.", // Low-High //
            "Tiendes a ser una persona un poco incooperativa y desconfiada."  // Low-Low //
        ],
        [ // Extrovertido //
            "Tiendes a ser una persona social, energética, entusiasta, comunicativa, y viva.", // High-High //
            "Tiendes a ser una persona agradable, conmovible, humilde y servicial.", // High-Low //
            "Tiendes a ser una persona astuta y de cierta manera manipuladora.", // Low-High //
            "Tiendes a ser una persona preocupada por otros, no muy comunicativa, y algo escéptica."  // Low-Low //
        ],
        [ // Estabilidad Emocional //
            "Tiendes a ser una persona apasionada, romántica y sentimental.", // High-High //
            "Tiendes a ser paciente, relajado, poco exigente, y aterrizado", // High-Low //
            "Tiendes a ser una persona algo crítica y exigente.", // Low-High //
            "Tiendes a ser una persona un poco desapasionada e insensible."  // Low-Low //
        ],
        [ // Apertura a la Experiencia //
            "Tiendes a ser una persona amistosa, idealista, diplomática y profunda.", // High-High //
            "Tiendes a ser simple y depender un poco de los demás.", // High-Low //
            "Tiendes a ser una persona perspicaz, excéntrica, e individualista.", // Low-High //
            "Tiendes a ser una persona un poco cerrada y algo áspera."  // Low-Low //
        ]
    ],
    [ // Responsabilidad //  Me quede en 11577: respnsabilidad_minus_agreeableness_minus
        [ // Cordialidad/Amabilidad //
            "Tiendes a ser una persona responsable, confiable y considerada.", // High-High //
            "Tiendes a ser una persona estricta y algo rígida.", // High-Low //
            "Tiendes a ser una persona modesta y no pretenciosa.", // Low-High //
            "Tiendes a ser una persona un poco desconfiada y incooperativa."  // Low-Low //
        ],
        [ // Responsabilidad //
            "N/A", // High-High //
            "N/A", // High-Low //
            "N/A", // Low-High //
            "N/A"  // Low-Low //
        ],
        [ // Extrovertido //
            "Tiendes a ser una persona activa, competitiva, persistente, y ambiciosa.", // High-High //
            "Tiendes a ser una persona reservada, discreta, cautelosa, y con principios.", // High-Low //
            "Tiendes a ser una persona expresiva, gregaria, y bulliciosa.", // Low-High //
            "Tiendes a ser una persona un poco apagada e impersistente."  // Low-Low //
        ],
        [ // Estabilidad Emocional //
            "Tiendes a ser una persona algo nerviosa y particular.", // High-High //
            "Tiendes a ser una persona racional, con objetivos, estable, y decisiva.", // High-Low //
            "Tiendes a ser una persona curiosa, un poco impulsiva y olvidadiza.", // Low-High //
            "Tiendes a ser una persona informal y sencilla."  // Low-Low //
        ],
        [ // Apertura a la Experiencia //
            "Tiendes a ser una persona perfeccionista, perceptiva, sofisticada y articulada.", // High-High //
            "Tiendes a ser una persona convencional y tradicional.", // High-Low //
            "Tiendes a ser una persona poco convencional y algo peculiar.", // Low-High //
            "Tiendes a ser una persona algo desorganizada e ilógica."  // Low-Low // Poca imaginación, imprudente, ilógico, inmaduro, desorganizado
        ]
    ],

    [ // Extrovertido //
        [ // Cordialidad/Amabilidad //
            "Tiendes a ser una persona efervescente, feliz, amigable, y jovial.", // High-High //
            "Tiendes a ser una persona astuta, dominante y algo abrupta.", // High-Low //
            "Tiendes a ser una persona sensible, agradable, servicial, humilde, y algo indulgente.", // Low-High //
            "Tiendes a desprenderte fácil de cosas y eres una persona un poco cínica."  // Low-Low //Cínico, preocupado por otros, reclusivo, impersonal
        ],
        [ // Responsabilidad //
            "Tiendes a ser una persona persistente, firme, activa, y competitiva.", // High-High //
            "Tiendes a ser una persona despreocupada, temeraria, y algo bulliciosa.", // High-Low //  Revoltoso, bullicioso, temerario, despreocupado, demostrativo
            "Tiendes a ser una persona cautelosa, confiada, puntual, formal, y ahorrativa.", // Low-High //
            "Tiendes a ser una persona un poco floja y sin ambiciones."  // Low-Low //
        ],
        [ // Extrovertido //
            "N/A", // High-High //
            "N/A", // High-Low //
            "N/A", // Low-High //
            "N/A"  // Low-Low //
        ],
        [ // Estabilidad Emocional //
            "Tiendes a ser una persona extravagante, expresiva, coqueta, y algo explosiva.", // High-High // Excitable, expresivo, coqueto, explosivo, extravagante
            "Tiendes a ser una persona cansada y un poco inconsciente.", // High-Low // infatigable
            "Tiendes a ser una persona guardada, reservada, y un poco pesimista.", // Low-High //Guardado, inseguro, displicente, reservado, pesimista
            "Tiendes a ser una persona calmada, plácida, y modesta."  // Low-Low //
        ],
        [ // Apertura a la Experiencia //
            "Tiendes a ser una persona teatral, elocuente, inquisitiva, y algo intensa.", // High-High //Mundano, teatral, elocuente, inquisitivo, intenso
            "Tiendes a ser una persona sin escrúpulos y algo pomposa.", // High-Low //
            "Tiendes a ser una persona interiorizada, pensativa, y guiada por sus propios valores.", // Low-High //
            "Tiendes a ser una persona predecible y no te gustan mucho las aventuras."  // Low-Low // sin imaginación, sombrío, apático, poco aventurero
        ]
    ],
    [ // Estabilidad Emocional //
        [ // Cordialidad/Amabilidad //
            "Tiendes a ser una persona apasionada, sentimental, afectiva, y sensible.", // High-High //sensible, blando, apasionado
            "Tiendes a ser una persona un poco impaciente y temperamental.", // High-Low //
            "Tiendes a ser una persona pacífica, generosa y paciente.", // Low-High //
            "Tiendes a ser una persona un poco desapasionada e insensible."  // Low-Low //
        ],
        [ // Responsabilidad //
            "Tiendes a ser una persona algo nerviosa y particular.", // High-High //
            "Tiendes a ser una persona olvidadiza, un poco incosistente e impulsiva.", // High-Low //Atolondrado, inconsistente, errático, egoísta, olvidadizo, impulsivo
            "Tiendes a ser una persona estable, consistente, disciplinada, y lógica.", // Low-High //
            "Tiendes a ser una persona informal y sencilla."  // Low-Low //
        ],
        [ // Extrovertido //
            "Tiendes a ser una persona extravagante, coqueta, y algo explosiva.", // High-High //
            "Tiendes a ser reservado, auto-crítico, y algo temeroso.", // High-Low //
            "Tiendes a ser una persona confiada, audaz, segura, y valiente.", // Low-High //
            "Tiendes a ser una persona modesta, tranquila, y algo plácida."  // Low-Low //
        ],
        [ // Estabilidad Emocional //
            "N/A", // High-High //
            "N/A", // High-Low //
            "N/A", // Low-High //
            "N/A"  // Low-Low //
        ],
        [ // Apertura a la Experiencia //
            "Tiendes a ser una persona apasionada y sensual.", // High-High //
            "Tiendes a ser una persona un poco aprensiva y fácil de molestar.", // High-Low //
            "Tiendes a ser una persona versátil, creativa, intelectual, perspicaz e inventiva.", // Low-High //
            "Tiendes a ser una persona imperturbable y algo insensible."  // Low-Low //
        ]
    ],
    [ // Apertura a la Experiencia //
        [ // Cordialidad/Amabilidad //
            "Tiendes a ser una persona diplomática, profunda, e idealista.", // High-High //
            "Tiendes a ser una persona perspicaz, excéntrica, e individualista.", // High-Low //
            "Tiendes a depender un poco de los demás.", // Low-High //
            "Tienes a ser un poco cerrado y brusco."  // Low-Low //
        ],
        [ // Responsabilidad //
            "Tiendes a ser una persona analítica, perceptiva, e informativa.", // High-High //
            "Tiendes a ser una persona poco convencional y algo peculiar.", // High-Low //
            "Tiendes a ser una persona convencional y tradicional.", // Low-High //
            "Tiendes a ser una persona laxa, temeraria, y un poco inmadura."  // Low-Low //
        ],
        [ // Extrovertido //
            "Tiendes a ser una persona expresiva, honesta, espontánea, ingeniosa, y algo dramática.", // High-High //
            "Tiendes a ser una persona introspectiva, mediática, auto-observadora, e interiorizada.", // High-Low //
            "Tiendes a ser una persona sin escrúpulos y algo pomposa.", // Low-High //
            "Tiendes a ser una persona predecible y no suelen gustarte las aventuras."  // Low-Low //
        ],
        [ // Estabilidad Emocional //
            "Tiendes a ser una persona apasionada y sensual.", // High-High //
            "Tiendes a ser una persona creativa, intelectual y versátil.", // High-Low //
            "Tiendes a ser una persona algo fácil de molestar.", // Low-High // irritable, aprensivo
            "Tiendes a ser una persona imperturbable y algo insensible."  // Low-Low //
        ],
        [ // Apertura a la Experiencia //
            "N/A", // High-High //
            "N/A", // High-Low //
            "N/A", // Low-High //
            "N/A"  // Low-Low //
        ]
    ]
];

function getTwoMoreRelevant(arrDatos){
  top1 = 0;
  top2 = 0;
  var high1 = 0;
  var high2 = 0;

  // Separa las posiciones del mas grande y segundo mas grande
  //top1 tiene el big_5 que se aleja mas del punto medio (sea percentile grande o chico)
  //top2 tiene el segundo que mas se aleja
    for (var i = 0; i < arrDatos.length; i++) {
      console.log("Percentile: " + arrDatos[i].percentile);
      console.log("High1: " +  high1);
      console.log("High2: " +  high2);
      if (arrDatos[i].percentile > high1) {
        high2 = high1;
  	    top2 = top1;

        high1 = arrDatos[i].percentile;
  	    top1 = i;
  } else if (arrDatos[i].percentile > high2) {
        high2 = arrDatos[i].percentile;
  	    top2 = i;
      }
    }


  return [top1, top2]; //regresa la posicion de los valores mas relevantes
}

//modifica los valores del percentile para que representen la distancia al punto medio (0.5)
function changeToRelevance(arrDatos){
  for (var i = 0; i < arrDatos.length; i++) {
    arrDatos[i].percentile = Math.abs(arrDatos[i].percentile - 0.5);
  }
}

function getBig5Desc(big5Array){
      var top1;
      var top2;
      var pair;
      var arrHiLo = [0,0];

      // llena un arreglo para ver si cada valor es alto o bajo
      //arrHilo especifica para cada big_5, si es alto (1 si es mayor a 0.5) o bajo (0, si es menor a 0.5)
      for (var i = 0; i < big5Array.length; i++) {
        if (big5Array[i].percentile > 0.5)
          arrHiLo[i] = 1;
        else
          arrHiLo[i] = 0;
      }

      //modifica los valores para ser distancia del punto medio
      changeToRelevance(big5Array);
      let response = getTwoMoreRelevant(big5Array);
      top1 = response[0];
      top2 = response[1];


      //Define las posiciones de la matriz 3D
      if (arrHiLo[top1] == 1 && arrHiLo[top2] == 1){ //H-H
        pair = 0;
      } else if (arrHiLo[top1] == 1 && arrHiLo[top2] == 0) {// H-L
        pair = 1;
      } else if (arrHiLo[top1] == 0 && arrHiLo[top2] == 0) {//L-L
        pair = 3;
      } else if (arrHiLo[top1] == 0 && arrHiLo[top2] == 1) {// L-H
        pair = 2;
      }

    //Regresa los 3 valores
    return myArrF[top1][top2][pair];
}

//clasificar si es
function classifyInFour(arrDatos, arrClass){
  for(var i = 0; i < arrDatos.length; i++){
    if(arrDatos[i].percentile < 0.25){
      arrClass[i] = "muyBajo";
    } else if(arrDatos[i].percentile >= 0.25 && arrDatos[i].percentile < 0.50){
      arrClass[i] = "bajo";
    } else if(arrDatos[i].percentile >= 0.50 && arrDatos[i].percentile < 0.75){
      arrClass[i] = "alto";
    } else {
      arrClass[i] = "muyAlto";
    }
  }
}

function getDescValues(arrValores){
    var arrClass = [0,0];
    var top1, top2, rango1, rango2;
    var valor1, valor2;

    console.log("entro a desc values");
   //clasificar en muy bajo, bajo, alto y muy alto
   classifyInFour(arrValores, arrClass);

   console.log("Valores");
   for(var i = 0; i < arrValores.length; i++){
     console.log(arrValores[i].percentile);
   }

   console.log("Clasificacion");
   for(var i = 0; i < arrClass.length; i++){
     console.log(arrClass[i]);
   }

   //cambiar el arreglo para que tenga el valor de relevancia
   changeToRelevance(arrValores);

   console.log("Valores");
   for(var i = 0; i < arrValores.length; i++){
     console.log(arrValores[i].percentile);
   }
   //
   response = getTwoMoreRelevant(arrValores);

   top1 = response[0];
   console.log("Top 1");
   console.log(top1);

   top2 = response[1];
   console.log("Top 2");
   console.log(top2);
   //
   valor1 = arrValores[top1].trait_id;
   valor2 = arrValores[top2].trait_id;
   rango1 = arrClass[top1];
   rango2 = arrClass[top2];

  return valores[valor1][rango1] + " " + valores[valor2][rango2];
}

//funcion para obtener la descripcion de la persona
function getImportantText(dataReceived) {
    return getBig5Desc(dataReceived.personality) + " " + getDescValues(dataReceived.values);
}

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
                console.log("EL AJAX RECIBIO ERROR");
                var openness = 0;
                var conscientiousness = 0;
                var extraversion = 0;
                var agreeableness = 0;
                var emotionalRange = 0;
            },

            success: function(dataReceived){

                    //console.log("Data that was received from the server: " + dataReceived.personality[0].name);
                    //console.log("Data received from the server, but I wont show it to you. Just kidding: " );
                    //console.log("All data" + dataReceived.personality[10].percentile);


                    console.log("Data: " + dataReceived.personality[0].percentile);
                    console.log("Data: " + dataReceived.personality[1].percentile);
                    console.log("Data: " + dataReceived.personality[2].percentile);
                    console.log("Data: " + dataReceived.personality[3].percentile);
                    console.log("Data: " + dataReceived.personality[4].percentile);

                    var agreeableness = dataReceived.personality[0].percentile * 100;
                    var conscientiousness = dataReceived.personality[1].percentile * 100;
                    var extraversion = dataReceived.personality[2].percentile * 100;
                    var emotionalRange = dataReceived.personality[3].percentile * 100;
                    var openness = dataReceived.personality[4].percentile * 100;

                    var agregar = `<p>${getBig5Desc(dataReceived.personality)}</p>`;
                    $("#insightsDescription").html(agregar);


                    //Grafica de big5
                    var myChart = new Chart(ctx, {
                        type: 'radar',
                        data: {
                            labels: ["Apertura", "Responsabilidad", "Extroversión", "Amabilidad", "Rango emocional"],
                            datasets: [{
                                label: 'Personalidad',
                                data: [openness, conscientiousness, extraversion, agreeableness, emotionalRange],
                                backgroundColor: "rgba(209,31,59,0.2)",
                                borderColor: "rgba(209,31,59,0.6)",
                                pointBackgroundColor: "rgba(209,31,59,0.6)",
                                pointBorderColor:  "rgba(209,31,59,0.6)",
                                pointRadius: 4,
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scale: {
                                ticks: {
                                  beginAtZero: true,
                                  min: 0,
                                  max: 100,
                                  stepSize: 10
                                }
                            }
                        }
                    });

                    // SQUARE CHART STARTS //
                    //Grafica de valores
                    Highcharts.chart('container2', {
                        series: [{
                            type: "treemap",
                            layoutAlgorithm: 'stripes',
                            alternateStartingDirection: true,
                            levels: [{
                                level: 1,
                                layoutAlgorithm: 'sliceAndDice',
                                dataLabels: {
                                    enabled: true,
                                    align: 'left',
                                    verticalAlign: 'top',
                                    style: {
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                        textShadow: 'none'
                                    }
                                }
                            }],
                            data: [{
                                id: 'A',
                                name: 'Conservación',
                                color: "#009688"
                            }, {
                                id: 'B',
                                name: 'Hedonismo',
                                color: '#EC9800'
                            }, {
                                id: 'C',
                                name: 'Apertura al Cambio',
                                color: "#2196F3"
                            }, {
                                id: 'D',
                                name: 'Superación Personal',
                                color: '#F44336'
                            }, {
                                id: 'E',
                                name: 'Autotranscendencia',
                                color: '#8BC34A'
                            }, {
                                parent: 'A',
                                name: Math.round(dataReceived.values[0].percentile*100) + "<h1>%</h1>",
                                value: dataReceived.values[0].percentile*100
                            }, {
                                parent: 'B',
                                name: Math.round(dataReceived.values[1].percentile*100) + "<h1>%</h1>",
                                value: dataReceived.values[1].percentile*100
                            }, {
                                parent: 'C',
                                name: Math.round(dataReceived.values[2].percentile*100) + "<h1>%</h1>",
                                value: dataReceived.values[2].percentile*100
                            }, {
                                parent: 'D',
                                name: Math.round(dataReceived.values[3].percentile*100) + "<h1>%</h1>",
                                value: dataReceived.values[3].percentile*100
                            }, {
                                parent: 'E',
                                name: Math.round(dataReceived.values[4].percentile*100) + "<h1>%</h1>",
                                value: dataReceived.values[4].percentile*100
                            }]
                        }],
                        title: {
                            text: 'Valores'
                        }
                    });

                    // // SQUARE CHARTS ENDS //
                    var agregar = `<p>${getDescValues(dataReceived.values)}</p>`;
                    $("#insightsDescription").append(agregar);

                    // BAR CHART STARTS //
                    //Grafica de necesidades   var myChart = new Chart
                    var necesidades = document.getElementById("container3").getContext('2d');
                    var myChart = new Chart(necesidades, {
                    type: 'bar',
                    data: {
                        labels: ["Desafío", "Proximidad", "Curiosidad", "Entusiasmo", "Armonía", "Ideales", "Libertad", "Amor", "Uso práctico", "Autoexpresión", "Estabilidad","Estructura"],
                        datasets: [{
                            label: 'Necesidades',
                            data: [dataReceived.needs[0].percentile*100,
                                   dataReceived.needs[1].percentile*100,
                                   dataReceived.needs[2].percentile*100,
                                   dataReceived.needs[3].percentile*100,
                                   dataReceived.needs[4].percentile*100,
                                   dataReceived.needs[5].percentile*100,
                                   dataReceived.needs[6].percentile*100,
                                   dataReceived.needs[7].percentile*100,
                                   dataReceived.needs[8].percentile*100,
                                   dataReceived.needs[9].percentile*100,
                                   dataReceived.needs[10].percentile*100,
                                   dataReceived.needs[11].percentile*100],
                            backgroundColor: ['rgba(125, 187, 195, 0.7)',
                            'rgba(125, 187, 195, 0.7)',
                            'rgba(125, 187, 195, 0.7)',
                            'rgba(125, 187, 195, 0.7)',
                            'rgba(125, 187, 195, 0.7)',
                            'rgba(125, 187, 195, 0.7)',
                            'rgba(125, 187, 195, 0.7)',
                            'rgba(125, 187, 195, 0.7)',
                            'rgba(125, 187, 195, 0.7)',
                            'rgba(125, 187, 195, 0.7)',
                            'rgba(125, 187, 195, 0.7)',
                            'rgba(125, 187, 195, 0.7)',
                                /*'#FF5722',
                                '#FF9800',
                                '#E91E63',
                                '#FFEB3B',
                                '#673AB7',
                                '#8BC34A',
                                '#4CAF50',
                                '#009688',
                                '#00BCD4',
                                '#9C27B0',
                                '#2196F3',
                                '#3F51B5',*/
                            ],
                            borderColor: [ 'rgba(125, 187, 195, 1)',
                            'rgba(125, 187, 195, 1)',
                            'rgba(125, 187, 195, 1)',
                            'rgba(125, 187, 195, 1)',
                            'rgba(125, 187, 195, 1)',
                            'rgba(125, 187, 195, 1)',
                            'rgba(125, 187, 195, 1)',
                            'rgba(125, 187, 195, 1)',
                            'rgba(125, 187, 195, 1)',
                            'rgba(125, 187, 195, 1)',
                            'rgba(125, 187, 195, 1)',
                            'rgba(125, 187, 195, 1)',
                                /*'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'*/
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
                // BAR CHART ENDS //

                // BUBBLE CHARTS STARTS //
                    // Highcharts.chart('container3', {
                    //
                    //   chart: {
                    //     type: 'bubble',
                    //     plotBorderWidth: 1,
                    //     zoomType: 'xy'
                    //   },
                    //
                    //   legend: {
                    //     enabled: false
                    //   },
                    //
                    //   title: {
                    //     text: ''
                    //   },
                    //
                    //   xAxis: {
                    //     gridLineWidth: 0,
                    //     tickColor: 'white',
                    //     title: null,
                    //     labels: {
                    //       enabled: false
                    //     },
                    //   },
                    //
                    //   yAxis: {
                    //     gridLineWidth: 0,
                    //     startOnTick: false,
                    //     endOnTick: false,
                    //     title: null,
                    //     labels: {
                    //       enabled: false
                    //     },
                    //     maxPadding: 0.2,
                    //   },
                    //
                    //   tooltip: {
                    //     useHTML: true,
                    //     headerFormat: '<table>',
                    //     pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                    //       '<tr><th></th><td>{point.z}%</td></tr>',
                    //     footerFormat: '</table>',
                    //     followPointer: true
                    //   },
                    //
                    //   plotOptions: {
                    //     series: {
                    //       dataLabels: {
                    //         enabled: true,
                    //         format: '{point.name}'
                    //       }
                    //     }
                    //   },
                    //
                    //   series: [{
                    //     data: [
                    //       { x: 0, y: 0, z: Math.round(dataReceived.needs[0].percentile*100), name: 'Retos', country: 'Retos', color: '#FF5722' },
                    //       { x: 5, y: 5, z: Math.round(dataReceived.needs[1].percentile*100), name: 'Reservarse', country: 'Reservarse', color: '#FF9800'},
                    //       { x: 10, y: 10, z: Math.round(dataReceived.needs[2].percentile*100), name: 'Curiosidad', country: 'Curiosidad', color: '#E91E63'},
                    //       { x: 15, y: 15, z: Math.round(dataReceived.needs[3].percentile*100), name: 'Emoción', country: 'Emoción', color: '#FFEB3B'},
                    //       { x: 20, y: 20, z: Math.round(dataReceived.needs[4].percentile*100), name: 'Armonía', country: 'Armonía', color: '#673AB7'},
                    //       { x: 25, y: 25, z: Math.round(dataReceived.needs[5].percentile*100), name: 'Ideales', country: 'Ideales', color: '#8BC34A'},
                    //       { x: 30, y: 30, z: Math.round(dataReceived.needs[6].percentile*100), name: 'Libertad', country: 'Libertad', color: '#4CAF50'},
                    //       { x: 35, y: 35, z: Math.round(dataReceived.needs[7].percentile*100), name: 'Amor', country: 'Amor', color: '#009688'},
                    //       { x: 40, y: 40, z: Math.round(dataReceived.needs[8].percentile*100), name: 'Práctico', country: 'Práctico', color: '#00BCD4'},
                    //       { x: 45, y: 45, z: Math.round(dataReceived.needs[9].percentile*100), name: 'Expresivo', country: 'Expresivo', color: '#9C27B0'},
                    //       { x: 50, y: 50, z: Math.round(dataReceived.needs[10].percentile*100), name: 'Estabilidad', country: 'Estabilidad', color: '#2196F3'},
                    //       { x: 55, y: 55, z: dataReceived.needs[11].percentile*100, name: 'Estructura', country: 'Estructura', color: '#3F51B5'},
                    //     ]
                    //   }]
                    //
                    // });

                    // BUBBLE CHARTS ENDS //

            }

        });
