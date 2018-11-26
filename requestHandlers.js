//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Proposito de este modulo: contener todas las funciones necesarias para despachar cualquier recurso (html,css,js,pdf,etc) o servicio (IBM PI, login, logout,etc) solicitado por un cliente
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var twit = require('twitter'); //modulo para utilizar la api de twitter y hacer gets de tweets de algun usuario, etc.
var fs = require('fs'); //modulo para accesar, crear, modificar, borrar archivos de extension .txt entre otros
var mysql = require('mysql'); //modulo para establecer una conexion con la base de datos de un servidor MySQL
var querystring = require('querystring'); //modulo para parsear en un objeto con sus atributos (ej. nombredelobjeto.atributo) a la informacion enviada por el usuario via metodo POST
var async = require("async");  //modulo para utilizar funciones asincronas (ej. each,foreach, y otros loops de manera asincrona)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Acceso al servidor MySQL para usar la base de datos que esta aplicacion web necesita
//Nota: cualquier servidor MySQL sirve, solo hay que ejecutar el script 'newCreation' (que se encuentra en este proyecto) en la base de datos
//      que el servidor nos esté prestando, y dicha base de datos sera util para esta aplicacion web
//Servidor MySQL provisto por: Gearhost.com
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//BASE De datos de prueba
var pool  = mysql.createPool({
 connectionLimit : 10,
 host            : 'den1.mysql2.gear.host',
 user            : 'piapplicationdb',
 password        : 'yell0wC@t',
 database        : 'piapplicationdb'
});

//Parametros para conectarse a la base de datos de digital ocean desde fuera del servidor
//falta habilitar que el servidor acepte conexiones que no sean de localhost
// var pool  = mysql.createPool({
//  connectionLimit : 10,
//  host            : '104.131.75.96',
//  user            : 'root',
//  password        : 'b930f62a8d513ae4962f7c37433aa263482f343d9ef60e77',
//  database        : 'MostlaPI'
// });

//Parametros para conectarse a la base de datos de digital ocean estando en el servidor,
// var pool  = mysql.createPool({
//  connectionLimit : 10,
//  host            : 'localhost',
//  user            : 'root',
//  password        : 'b930f62a8d513ae4962f7c37433aa263482f343d9ef60e77',
//  database        : 'MostlaPI'
// });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Credenciales para utilizar la API de twitter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var twitter = new twit({

consumer_key : 'hhsmOJJ5xJelPS2IWZt9KsT2O', //Credenciales para autenticar la APLICACION WEB
consumer_secret : '74VD7iRFWMxWiyji2LqWKfXHGG4OvJy3lZGvrE5i6hL1hKMhwB', //Credenciales para autenticar la APLICACION WEB
access_token_key : '3257919310-aE7rBtDVCTFlSJDe6gnRAiVLXEINGlw5hTuoJN6', //Credenciales para autenticar al USUARIO (permite a la aplicacion postear tweets en la cuenta del usuario autenticado)
access_token_secret : 'Ba1Ui4sAQ6QB4EECiDRlNOH6RN5o9OV9hBX38LXvYsMtU' //Credenciales para autenticar al USUARIO (permite a la aplicacion postear tweets en la cuenta del usuario autenticado)

});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Credenciales para utilizar la API de IBM Personality Insights
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var personality_insights = new PersonalityInsightsV3({
      username: 'ebc5e198-5f1b-4353-ae47-810792af98d0',
      password: 'hyh0VJTjfm1E',
      version_date: '2017-10-13'
  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funcion que entrega al cliente la view para iniciar sesion en la app web
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loginPage(response, postData, cookieJar) {
	console.log("Request handler 'start' was called.");
	fs.readFile('./public/login.html', null, function (error,data){

		if (error){
			response.writeHead( 302, { "Location": "./public/error.html" } );
			//response.write('File not found!');
		} else{
      response.writeHead(200, {"Content-Type": "text/html"});
			response.write(data);
		}

		response.end();

	});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funcion que entrega al cliente la view que contiene informacion ilustrativa de la app web
//Nota: El usuario tiene que tener una sesion activa para poder acceder a este recurso (validado en el modulo 'router')
//Nota: Acceder a esta view hace incrementar la fecha de caducidad de la sesion del usuario en media hora (se requiere media hora de inactividad para
//      destruir la sesion del usuario)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function infoPage(response, postData, cookieJar) {
	console.log("Request handler 'info' was called.");

  //Incrementa en media hora la fecha de caducidad de la cookie que ya estaba guardada
  var name = cookieJar.get("name");
  var id_user = cookieJar.get("email");

  var someDate = new Date();
  someDate.setTime(someDate.getTime() + (30*60*1000) ) ;

  cookieJar.set( "email", id_user , { httpOnly: false, expires: someDate} );
  cookieJar.set( "name", name , { httpOnly: false, expires: someDate} );


	fs.readFile('./public/info.html', null, function (error,data){

		if (error){
      response.writeHead( 302, { "Location": "./public/error.html" } );
			//response.write('File not found!');
		} else{

      response.writeHead(200, {"Content-Type": "text/html"});
			response.write(data);
		}

		response.end();

	});
}


function homePage(response, postData, cookieJar) {
  console.log("Request handler 'principal' was called.");
  //Get name and email from login (for execution of queries)

  var name = cookieJar.get("name");
  var id_user = cookieJar.get("email");

  var someDate = new Date();
  someDate.setTime(someDate.getTime() + (30*60*1000) ) ; // 30 minutes in milliseconds

  cookieJar.set( "email", id_user , { httpOnly: false, expires: someDate} );
  cookieJar.set( "name", name , { httpOnly: false, expires: someDate} );


  var nextPage = "";
  pool.query("SELECT id FROM Profile WHERE id_user = '"+id_user+"' order by id desc LIMIT 1;",function(err,rows){
            if(err) throw err;
            //console.log(rows == NULL);
            console.log(rows.length);

            if(rows.length == 0){
              console.log("\nNO EXISTOOOO\n");
              fs.readFile('./public/index2.html', null, function (error,data){

                if (error){
                  response.writeHead( 302, { "Location": "./public/error.html" } );
                  console.log("No file found at location ... index2");
                  //response.write('File not found! index2');
                } else{
                  response.writeHead(200, {"Content-Type": "text/html"});
                  response.write(data);
                }

                response.end();

              });
            }
            else{
              console.log("\nSI EXISTOOOOO\n");
              fs.readFile('./public/index.html', null, function (error,data){

                if (error){
                  response.writeHead( 302, { "Location": "./public/error.html" } );
                  console.log("No file found at location ... index");
                  //response.write('File not found! index');
                } else{
                  response.writeHead(200, {"Content-Type": "text/html"});
                  response.write(data);
                }

                response.end();

              });
            }
    });

}


function uploadPage(response, postData, cookieJar) {
  console.log("Request handler 'upload' was called.");


  //Incrementa en media hora la fecha de caducidad de la cookie que ya estaba guardada
  var name = cookieJar.get("name");
  var id_user = cookieJar.get("email");

  var someDate = new Date();
  someDate.setTime(someDate.getTime() + (30*60*1000) ) ; // 30 minutes in milliseconds

  cookieJar.set( "email", id_user , { httpOnly: false, expires: someDate} );
  cookieJar.set( "name", name , { httpOnly: false, expires: someDate} );


  fs.readFile('./public/index2.html', null, function (error,data){

    if (error){
      response.writeHead( 302, { "Location": "./public/error.html" } );
      console.log("No file found at location");
      //response.write('File not found!');
    } else{
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(data);
    }

    response.end();

  });
}

function fullReportJson(response,postData, cookieJar){

  //Incrementa en media hora la fecha de caducidad de la cookie que ya estaba guardada
  var name = cookieJar.get("name");
  var id_user = cookieJar.get("email");

  var someDate = new Date();
  someDate.setTime(someDate.getTime() + (30*60*1000) ) ; // 30 minutes in milliseconds

  cookieJar.set( "email", id_user , { httpOnly: false, expires: someDate} );
  cookieJar.set( "name", name , { httpOnly: false, expires: someDate} );

  pool.query("SELECT completeJson FROM Profile WHERE id_User='"+id_user+"' order by id desc LIMIT 1;", function (err, result) {
      if (err) throw err;

      var json = result[0]["completeJson"];

      response.writeHead(200, {"Content-Type": "application/json"});
      response.end(json);

    });

}


function piServiceEssay(response,postData, cookieJar){
  console.log("Request handler 'piService' was called.");
  console.log("'piService' handler received: ");

  console.log(querystring.parse(postData).textAreaContent);
  console.log(querystring.parse(postData));

  var profileName = querystring.parse(postData).profileName;
  var gender = querystring.parse(postData).gender;



  //Incrementa en media hora la fecha de caducidad de la cookie que ya estaba guardada
  var name = cookieJar.get("name");
  var id_user = cookieJar.get("email");

  var someDate = new Date();
  someDate.setTime(someDate.getTime() + (30*60*1000) ) ; // 30 minutes in milliseconds

  cookieJar.set( "email", id_user , { httpOnly: false, expires: someDate} );
  cookieJar.set( "name", name , { httpOnly: false, expires: someDate} );



  var params = {
      // Get the content from the text file.
      // Content: el texto a analizar
      content: querystring.parse(postData).textAreaContent,
      // Content-type: el tipo de archivo a analizar, en este caso plain text
      content_type: 'text/plain;charset=utf-8',
      content_language: querystring.parse(postData).idiomaEnsayo, //idioma ensayo es el valor del select del idioma
      consumption_preferences: true,
      raw_scores: true
      //en
  };

  // Envia los parametros a Personality Insights
  personality_insights.profile(params, function(error, json) {
    if (error){
      console.log('Error:', error);
      response.end();
    } else{


       var valuesFromSelection = [];
       var id = 0;

       //Guarda el json en un archivo .txt dentro del servidor que este corriendo esta aplicacion web
      fs.exists('documents/analisisPI.txt', function(exists){
        if(exists){
            console.log("yes file exists");
            //fs.appendFile('analisisPI.txt', json);

             fs.appendFile('documents/analisisPI.txt', '\r\n', function (err) {
                if (err) return console.log(err);
                console.log('successfully appended new line');
             });

             fs.appendFile('documents/analisisPI.txt', JSON.stringify(json), function (err) {
                if (err) return console.log(err);
                console.log('successfully appended json info');
            });
         } else {
            console.log("file not exists")
            //fs.appendFile('analisisPI.txt', json);
            fs.appendFile('documents/analisisPI.txt', JSON.stringify(json), function (err) {
                if (err) return console.log(err);
                console.log('successfully appended json info');
            });
         }
      });


      var stringJson = JSON.stringify(json);

      // pool.query("INSERT INTO Profile (name,word_Count,processed_Language,id_User,fecha) VALUES ('" + name + "','" + json.word_count + "','" + json.processed_language + "','" + id_user + "', NOW());",function(err,rows){

            // pool.query("INSERT INTO Profile (name,word_Count,processed_Language,id_User,fecha, completeJson) VALUES ('" + name + "','" + json.word_count + "','" + json.processed_language + "','" + id_user + "', NOW(),'" + stringJson + "');",function(err,rows){
            //INSERT INTO InfoAuthor (gender) VALUES ('"+ gender "');
      //Create profile in database
      pool.query("INSERT INTO InfoAuthor (gender) VALUES ('"+ gender + "');", function(err,rows0){
          if(err) throw err;

          pool.query("SELECT id_author FROM InfoAuthor ORDER BY id_author desc LIMIT 1;", function(err,rows1){

              if(err) throw err;

              id_author = rows1[0].id_author;

              pool.query("INSERT INTO Profile (name,word_Count,processed_Language,id_User,fecha, completeJson, profileName, id_author) VALUES ('" + name + "','" + json.word_count + "','" + json.processed_language + "','" + id_user + "', NOW(),'" + stringJson + "','" + profileName + "'," + id_author + ");",function(err,rows){
                      if(err) throw err;
                      console.log('PERFIL CREADO');

                      //Sacar el id
                      pool.query("SELECT id FROM Profile WHERE id_User = '" + id_user + "' ORDER BY id desc LIMIT 1;",function(err,rows){
                                var papasCreados = 0;
                                if(err) throw err;
                                valuesFromSelection = rows;
                                //console.log(valuesFromSelection[0].id); //Imprime id
                                id = valuesFromSelection[0].id;
                                //Insertar los 5 big_5
                                for (var iA = 0; iA < 5; iA++) {
                                  pool.query("INSERT INTO Trait (trait_id,name,percentile,category,profile_id, child_Of) VALUES ('" + json.personality[iA].trait_id + "','" +  json.personality[iA].name + "','" + json.personality[iA].percentile + "','" +  json.personality[iA].category+ "'," + id + ", NULL);",function(err,rows){
                                          if(err) throw err;
                                          //console.log("Big Five Creado");
                                          papasCreados++; //papa = 1 big_5
                                          //console.log(papasCreados);

                                          //Inserta los hijos de cada big_5, una vez que estos 5 ya fueron creados
                                          if(papasCreados>=5){
                                            console.log("YA VOY A CREAR LOS HIJOS");
                                              for(iA = 0; iA<5; iA++){
                                              for (var iB = 0; iB < json.personality[iA].children.length; iB++) {
                                                console.log("\n"+json.personality[iA].name+"\n");
                                                console.log( json.personality[iA].children[iB].trait_id );
                                                console.log( json.personality[iA].children[iB].name);
                                                console.log( json.personality[iA].children[iB].percentile);
                                                console.log( json.personality[iA].children[iB].category);
                                                console.log( json.personality[iA].trait_id);

                                              pool.query("INSERT INTO Trait (trait_id,name,percentile,category,profile_id, child_Of) VALUES ('" + json.personality[iA].children[iB].trait_id
                                              + "','" +  json.personality[iA].children[iB].name + "','" + json.personality[iA].children[iB].percentile + "','" +  json.personality[iA].children[iB].category
                                              + "'," + id + ",'" + json.personality[iA].trait_id + "');",function(err,rows){
                                                        if(err) throw err;
                                                        console.log('Children Created');
                                                });
                                              }
                                            }
                                        }
                                  });
                                }
                                //Save needs in database
                                for (var iC = 0; iC < json.needs.length; iC++) {
                                  pool.query("INSERT INTO Trait (trait_id,name,percentile,category,profile_id, child_Of) VALUES ('" + json.needs[iC].trait_id
                                  + "','" +  json.needs[iC].name + "','" + json.needs[iC].percentile + "','" +  json.needs[iC].category
                                  + "'," + id + ", NULL);",function(err,rows){
                                            if(err) throw err;
                                            console.log('NEED Created');
                                    });
                                }

                                //Save values in database
                                for (var iD = 0; iD < json.values.length; iD++) {
                                  pool.query("INSERT INTO Trait (trait_id,name,percentile,category,profile_id, child_Of) VALUES ('" + json.values[iD].trait_id
                                  + "','" +  json.values[iD].name + "','" + json.values[iD].percentile + "','" +  json.values[iD].category
                                  + "'," + id + ", NULL);",function(err,rows){
                                            if(err) throw err;
                                            console.log('VALUE Created');
                                    });
                                }
                        });
              });

          });
      });


        fs.readFile('./public/index.html', null, function (error,data){

        if (error){
          response.writeHead( 302, { "Location": "./public/error.html" } );
          //response.write('File not found!');
        } else{
          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(data);
        }

        response.end();

      });


    }
  });

}

//funcion para restarle 1 a un numero
function decStrNum (n) {
    n = n.toString();
    var result=n;
    var i=n.length-1;
    while (i>-1) {
      if (n[i]==="0") {
        result=result.substring(0,i)+"9"+result.substring(i+1);
        i --;
      }
      else {
        result=result.substring(0,i)+(parseInt(n[i],10)-1).toString()+result.substring(i+1);
        return result;
      }
    }
    return result;
}

function piServiceTwitter(response,postData, cookieJar){

/*
console.log("Request handler 'piService' was called.");
 twitter.get('oauth/authorize', {force_login:true}, function(error, tweets, response) {
 });*/


  console.log("Request handler 'piServiceTwitter' was called.");

    //Incrementa en media hora la fecha de caducidad de la cookie que ya estaba guardada
  var name = cookieJar.get("name");
  var id_user = cookieJar.get("email");


  var someDate = new Date();
  someDate.setTime(someDate.getTime() + (30*60*1000) ) ; // 30 minutes in milliseconds

  cookieJar.set( "email", id_user , { httpOnly: false, expires: someDate} );
  cookieJar.set( "name", name , { httpOnly: false, expires: someDate} );




  var twitterAccount = querystring.parse(postData).twitterAccount;
  var tweetsLang = querystring.parse(postData).tweetsLang;


  var twitterContent = {
                  "contentItems":[]
                };


  var twitterParams = { screen_name: twitterAccount,
                        count:200,
                        exclude_replies : true, // EN EL DEMO NO INCLUYEN REPLIES
                        trim_user: true,
                        include_rts: false
                      };

  var count = 1;
  var tweetNum = 1;
  var latestMaxID ;
  var pastMaxID = -1;
  var notEnoughTweets = false;
  var somethingWrong = false;


          async.whilst(
              //Mientras aun no esten empaquetados al menos 3200 tweets de la cuenta de Twitter que se esté analizando, y mientras a dicha cuenta aun le queden tweets
              function() { return (twitterContent.contentItems.length < 3200 && !notEnoughTweets && !somethingWrong); },

              function(outerCallback) {

                    //cuando ya se han leido tweets tienes que empezar a leer desde el max_id para abajo para no leer los mismos tweets, por eso se incluye
                    //max_id
                    if (count > 1){

                        console.log("Final latest max_id" + latestMaxID);
                         twitterParams = { screen_name: twitterAccount,
                                count:200,
                                exclude_replies : true,
                                trim_user: true,
                                max_id : latestMaxID,
                                include_rts: false
                              };
                    }


                    //Obten un maximo de 200 tweets (los mas recientes) que se han posteado en la cuenta de twitter
                   twitter.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {


                      if (!error) {

                          //Empaqueta los tweets obtenidos en un arreglo de objetos (la configuracion de dicho arreglo es estrictamente especifica para poder ser analizado por el servicio PI de IBM)
                          async.forEachOf(tweets, function (element, index, innerCallback){

                             if(!element.retweeted){ //solo seleccionar los tweets del idioma especificado por el usuario

                               console.log("Curent_user_retweet : " + element.current_user_retweet);
                                if (element.in_reply_to_screen_name != null) {
                                    var parentid = element.in_reply_to_user_id;
                                 } else if (element.retweeted && (element.current_user_retweet != null)) {
                                     var parentid = element.current_user_retweet.id_str;
                                 }


                               var contentItem = {
                                                    "content": element.text.replace('[^(\\x20-\\x7F)]*',''),
                                                    "id": element.id_str,
                                                    "created": Date.parse(element.created_at),
                                                    "contenttype" : 'text/plain',
                                                    "language": element.lang,
                                                    "reply": element.in_reply_to_screen_name != null,
                                                    "parentid": parentid
                                                 };

                               console.log('Content Item ESTO ES DE TWITTER CONTENT NORMAL:');
                               console.log('packing tweet number ' + tweetNum);
                               console.log('_____________________________________');
                               console.log('id: ' + contentItem.id);
                               console.log('content: ' + contentItem.content);
                               console.log('created: ' + contentItem.created);
                               console.log('language: ' + contentItem.language);
                               console.log('contenttype: ' + contentItem.contenttype);
                               console.log('_____________________________________');

                               tweetNum = tweetNum + 1;
                               twitterContent.contentItems.push(contentItem);
                             }

                             innerCallback();

                           }, function(err){

                                //Terminado de empaquetar esta ronda de tweets, manda a llamar otra iteracion (para ir a buscar otros 200 tweets)
                                console.log(err);
                                console.log('finished packing all the tweets for round ' + count);
                                console.log('Amount of tweets packed until now:' + twitterContent.contentItems.length);
                                count = count + 1;

                                console.log("Latest Max Id: " + latestMaxID);

                                //al pasar Max_ID como parametro estas pidiendo los tweets con id menor o igual a max_id,
                                //como es inclusive hay que restarle 1 al id para que no se repitan tweets, es necesaria la funcion
                                //decStrNum porque javascript no puede representar ints con precision de 64 bits
                                latestMaxID = decStrNum(twitterContent.contentItems[twitterContent.contentItems.length - 1].id);

                                console.log("New Latest Max Id: " + latestMaxID);

                                if (latestMaxID != pastMaxID){
                                  pastMaxID = latestMaxID
                                } else {
                                  notEnoughTweets = true;
                                }

                                outerCallback();

                              }
                          );

                      } else { //Si, por ejemplo, la cuenta de twitter a analizar no existe

                          somethingWrong = true;

                      }

                  });
              },

              function (err, n) {

                  console.log("FINISHED PACKING ALL TWEETS");
                  console.log()

                  //FALTA QUE SIEMPRE TE PERMITA HACER EL ANALISIS Y QUE TE DESPLIEGUE LA FORTALEZA DEL ANALISIS
                  if (somethingWrong) //if (notEnoughTweets || somethingWrong)
                  {
                     if (notEnoughTweets){

                        console.log("NOT ENOUGH TWEETS IN GENERAL");
                        var someDate = new Date();
                        someDate.setTime(someDate.getTime() + (30*60*1000) ) ; // 30 minutes in milliseconds
                        cookieJar.set( "failedTwitterAccount", twitterAccount , { httpOnly: false, expires: someDate} );
                        cookieJar.set( "tweetsLang", tweetsLang , { httpOnly: false, expires: someDate} );

                     } else if (somethingWrong){

                        console.log("SOMETHING WRONG, MAYBE THE ACCOUNT DOES NOT EXIST");
                        var someDate = new Date();
                        someDate.setTime(someDate.getTime() + (30*60*1000) ) ; // 30 minutes in milliseconds
                        cookieJar.set( "somethingWrong", twitterAccount , { httpOnly: false, expires: someDate} );

                     }

                    pool.query("SELECT id FROM Profile WHERE id_User = '"+id_user+"' order by id desc LIMIT 1;",function(err,rows){
                            if(err) throw err;
                            //console.log(rows == NULL);
                            console.log(rows.length);

                            if(rows.length == 0){
                              console.log("\nNO EXISTOOOO\n");
                              fs.readFile('./public/index2.html', null, function (error,data){

                                if (error){
                                  response.writeHead( 302, { "Location": "./public/error.html" } );
                                  console.log("No file found at location ... index2");
                                  //response.write('File not found! index2');
                                } else{
                                  response.writeHead(200, {"Content-Type": "text/html"});
                                  response.write(data);
                                }

                                response.end();

                              });
                            }
                            else{
                              console.log("\nSI EXISTOOOOO\n");
                              fs.readFile('./public/index.html', null, function (error,data){

                                if (error){
                                  response.writeHead( 302, { "Location": "./public/error.html" } );
                                  console.log("No file found at location ... index");
                                  //response.write('File not found! index');
                                } else{
                                  response.writeHead(200, {"Content-Type": "text/html"});
                                  response.write(data);
                                }

                                response.end();

                              });
                            }
                      });

                  } else {

                      var params = {
                              content: twitterContent,
                              // Content-type: el tipo de archivo a analizar, en este caso plain text
                              content_type: 'application/json',
                              content_language: tweetsLang,
                              include_raw: false
                      };



                        // Envia los parametros a Personality Insights
                        personality_insights.profile(params, function(error, json) {
                          if (error){
                            console.log('Error:', error);
                            response.end();
                          } else{

                            console.log("WORD COUNT");
                              console.log(json.word_count);
                             var valuesFromSelection = [];
                             var id = 0;

                             //Guarda el json en un archivo .txt dentro del servidor que este corriendo esta aplicacion web
                            fs.exists('documents/analisisPI.txt', function(exists){
                              if(exists){
                                  console.log("yes file exists");
                                  //fs.appendFile('analisisPI.txt', json);

                                   fs.appendFile('documents/analisisPI.txt', '\r\n', function (err) {
                                      if (err) return console.log(err);
                                      console.log('successfully appended new line');
                                   });

                                   fs.appendFile('documents/analisisPI.txt', JSON.stringify(json), function (err) {
                                      if (err) return console.log(err);
                                      console.log('successfully appended json info');
                                  });
                               } else {
                                  console.log("file not exists")
                                  //fs.appendFile('analisisPI.txt', json);
                                  fs.appendFile('documents/analisisPI.txt', JSON.stringify(json), function (err) {
                                      if (err) return console.log(err);
                                      console.log('successfully appended json info');
                                  });
                               }
                            });

                            var stringJson = JSON.stringify(json);

                            //Create profile in database
                            pool.query("INSERT INTO Profile (name,word_Count,processed_Language,id_User,fecha,completeJson) VALUES ('" + name + "','" + json.word_count + "','" + json.processed_language + "','" + id_user + "', NOW(),'" + stringJson + "');",function(err,rows){
                                    if(err) throw err;
                                    console.log('PERFIL CREADO');

                                    //Sacar el id
                                    pool.query("SELECT id FROM Profile WHERE id_User = '" + id_user + "' ORDER BY id desc LIMIT 1;",function(err,rows){
                                              var papasCreados = 0;
                                              if(err) throw err;
                                              valuesFromSelection = rows;
                                              //console.log(valuesFromSelection[0].id); //Imprime id
                                              id = valuesFromSelection[0].id;
                                              //Insertar los 5 big_5
                                              for (var iA = 0; iA < 5; iA++) {
                                                pool.query("INSERT INTO Trait (trait_id,name,percentile,category,profile_id, child_Of) VALUES ('" + json.personality[iA].trait_id + "','" +  json.personality[iA].name + "','" + json.personality[iA].percentile + "','" +  json.personality[iA].category+ "'," + id + ", NULL);",function(err,rows){
                                                        if(err) throw err;
                                                        //console.log("Big Five Creado");
                                                        papasCreados++; //papa = 1 big_5
                                                        //console.log(papasCreados);

                                                        //Inserta los hijos de cada big_5, una vez que estos 5 ya fueron creados
                                                        if(papasCreados>=5){
                                                          console.log("YA VOY A CREAR LOS HIJOS");
                                                            for(iA = 0; iA<5; iA++){
                                                            for (var iB = 0; iB < json.personality[iA].children.length; iB++) {
                                                              console.log("\n"+json.personality[iA].name+"\n");
                                                              console.log( json.personality[iA].children[iB].trait_id );
                                                              console.log( json.personality[iA].children[iB].name);
                                                              console.log( json.personality[iA].children[iB].percentile);
                                                              console.log( json.personality[iA].children[iB].category);
                                                              console.log( json.personality[iA].trait_id);

                                                            pool.query("INSERT INTO Trait (trait_id,name,percentile,category,profile_id, child_Of) VALUES ('" + json.personality[iA].children[iB].trait_id
                                                            + "','" +  json.personality[iA].children[iB].name + "','" + json.personality[iA].children[iB].percentile + "','" +  json.personality[iA].children[iB].category
                                                            + "'," + id + ",'" + json.personality[iA].trait_id + "');",function(err,rows){
                                                                      if(err) throw err;
                                                                      console.log('Children Created');
                                                              });
                                                            }
                                                          }
                                                      }
                                                });
                                              }
                                              //Save needs in database
                                              for (var iC = 0; iC < json.needs.length; iC++) {
                                                pool.query("INSERT INTO Trait (trait_id,name,percentile,category,profile_id, child_Of) VALUES ('" + json.needs[iC].trait_id
                                                + "','" +  json.needs[iC].name + "','" + json.needs[iC].percentile + "','" +  json.needs[iC].category
                                                + "'," + id + ", NULL);",function(err,rows){
                                                          if(err) throw err;
                                                          console.log('NEED Created');
                                                  });
                                              }

                                              //Save values in database
                                              for (var iD = 0; iD < json.values.length; iD++) {
                                                pool.query("INSERT INTO Trait (trait_id,name,percentile,category,profile_id, child_Of) VALUES ('" + json.values[iD].trait_id
                                                + "','" +  json.values[iD].name + "','" + json.values[iD].percentile + "','" +  json.values[iD].category
                                                + "'," + id + ", NULL);",function(err,rows){
                                                          if(err) throw err;
                                                          console.log('VALUE Created');
                                                  });
                                              }


                                              fs.readFile('./public/index.html', null, function (error,data){

                                                    if (error){
                                                      response.writeHead( 302, { "Location": "./public/error.html" } );
                                                      console.log("No file found at location ... index");
                                                      //response.write('File not found! index');
                                                    } else{
                                                      response.writeHead(200, {"Content-Type": "text/html"});
                                                      response.write(data);
                                                    }

                                                    response.end();

                                            });



                                      });
                            });


                          }
                        }); //AQUI TERMINA LA FUNCION DE PERSONALITY INSIGHTS


                  }




              }

          );


  //=====================================================================================================================
  //=====================================================================================================================
}


function lastProfile(response,postData, cookieJar){
  console.log("Request handler 'lastProfile' was called.");



  //Incrementa en media hora la fecha de caducidad de la cookie que ya estaba guardada
  var name = cookieJar.get("name");
  var id_user = cookieJar.get("email");

  var someDate = new Date();
  someDate.setTime(someDate.getTime() + (30*60*1000) ) ; // 30 minutes in milliseconds
 //someDate.toISOString().replace(/T/, ' ').replace(/\..+/, '')
  cookieJar.set( "email", id_user , { httpOnly: false, expires: someDate} );
  cookieJar.set( "name", name , { httpOnly: false, expires: someDate} );


  //Query SELECT con name y id_user
  var arraySelects = [];
  var currentID;
  pool.query("SELECT id FROM Profile WHERE id_User='"+id_user+"' order by id desc LIMIT 1;", function (err, result) {
      if (err) throw err;
      arraySelects = result;
      currentID = arraySelects[0].id;
      pool.query("SELECT trait_id, percentile FROM Trait t join Profile p ON t.profile_id = p.id WHERE (t.trait_id = 'big5_agreeableness' or t.trait_id = 'big5_openness' or t.trait_id = 'big5_conscientiousness' or t.trait_id = 'big5_extraversion' or t.trait_id = 'big5_neuroticism') and p.id = '"+currentID+"'ORDER BY t.trait_id ASC;", function (err, result, fields) {
          if (err) throw err;

          //response.writeHead(200, {"Content-Type": "application/json"});

          var personalityArray = [];
          for (var i = 0;i < result.length; i++) {
              personalityArray.push({trait_id: result[i].trait_id, percentile: result[i].percentile});
          }

          pool.query("select trait_id, percentile from Trait t join Profile p ON t.profile_id = p.id where t.category='needs' and p.id = '"+currentID+"'order by t.trait_id ASC;", function (err, result, fields) {
              if (err) throw err;
              var needsArray = [];
              for (var i = 0;i < result.length; i++) {
                  needsArray.push({trait_id: result[i].trait_id, percentile: result[i].percentile});
              }
              pool.query("select trait_id, percentile from Trait t join Profile p ON t.profile_id = p.id where t.category='values' and p.id = '"+currentID+"'order by t.trait_id ASC;", function (err, result, fields) {
                  if (err) throw err;
                  var valuesArray = [];
                  for (var i = 0;i < result.length; i++) {
                      valuesArray.push({percentile: result[i].percentile, trait_id: result[i].trait_id});
                  }

                  var json = JSON.stringify({
                    personality: personalityArray,
                    needs: needsArray,
                    values: valuesArray
                  });

                  response.writeHead(200, {"Content-Type": "application/json"});
                  response.end(json);
                });
            });
        });
    });
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funcion para iniciar la sesion del usuario en la app web (se crean cookies)
//Nota: la view que se entrega al usuario despues de iniciar sesion depende de cual sea su situacion (tiene o no tiene un analisis de personalidad ya guardado)
//Nota: La fecha de caducidad de la sesion es de media hora de inactividad
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loginAction(response, postData, cookieJar){

  console.log("Request handler 'login' was called.");

  //Utiliza la informacion que el usuario envio
  var id_user = querystring.parse(postData).email;
  var name = querystring.parse(postData).text;

  //Si el usuario escribio su correo, se le permite entrar en la app web
  if (id_user != null){

    var someDate = new Date();
    someDate.setTime(someDate.getTime() + (30*60*1000) ) ;
    //someDate =  someDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    //document.cookie = 'foo=bar;path=/;expires='+d.toGMTString()+';';

    //Crea por primera vez las cookies
    cookieJar.set( "email", id_user , { httpOnly: false, expires: someDate} );
    cookieJar.set( "name", name , { httpOnly: false, expires: someDate } );

    var nextPage = "";

    //Busca si el usuario tiene guardado en la base de datos algun analisis de personalidad
    pool.query("SELECT id FROM Profile WHERE id_User = '"+id_user+"' order by id desc LIMIT 1;",function(err,rows){
              if(err) throw err;
              //console.log(rows == NULL);
              console.log(rows.length);

              //Si el usuario NO tiene guardado un analisis, entrega la view en la cual se puede se puede subir un ensayo para ser analizado
              if(rows.length == 0){
                console.log("\nNO EXISTOOOO\n");
                fs.readFile('./public/index2.html', null, function (error,data){

                  if (error){
                    response.writeHead( 302, { "Location": "./public/error.html" } );
                    console.log("No file found at location ... index2");
                  } else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data);
                  }

                  response.end();

                });
              }
              //Si el usuario tiene guardado un analisis, entrega la view que despliega con graficas dicho analisis
              else{
                console.log("\nSI EXISTOOOOO\n");
                fs.readFile('./public/index.html', null, function (error,data){

                  if (error){
                    response.writeHead( 302, { "Location": "./public/error.html" } );
                    console.log("No file found at location ... index");
                  } else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data);
                  }

                  response.end();

                });
              }
      });

      //Si el usario NO escribio su correo, NO se le permite entrar en la app web (se le entrega de nuevo la view para iniciar sesion)
    } else {

        console.log("NO SE INGRESO NINGUN CORREO. LOGIN NO REALIZADO.");
        fs.readFile('./public/login.html', null, function (error,data){

        if (error){
          response.writeHead( 302, { "Location": "./public/error.html" } );
          //response.write('File not found!');
        } else{
          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(data);
        }

        response.end();

      });


    }

}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funcion para terminar la sesion del usuario en la app web (se DESTRUYEN sus cookies),
//Nota: Para poder realizar esta accion el usuario tiene que tener una sesion activa
//Nota: Al realizar esta accion, se entrega al usuario la pagina para iniciar sesion
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function logoutAction(response, postData, cookieJar){

  console.log("Request handler 'logout' was called.");


  //Destruye la cookie dandole una fecha de expiracion ya pasada
  var someDate = new Date();
  someDate.setTime(someDate.getTime() - 500000 ) ;

  cookieJar.set( "email", "dummy", { httpOnly: false, expires: someDate} );
  cookieJar.set( "name", "dummy" , { httpOnly: false, expires: someDate} );

  fs.readFile('./public/login.html', null, function (error,data){

    if (error){
      response.writeHead( 302, { "Location": "./public/error.html" } );
      //response.write('File not found!');
    } else{
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(data);
    }

    response.end();

  });


}

function pdfService(response,postData, pathname){
  //console.log("Request handler 'pdfService' was called. The file " + querystring.parse(postData).pdfNombre + " was requested.");
  console.log("Request handler 'pdfService' was called. The file " + pathname + " was requested.");

  //var nombrePDF =  querystring.parse(postData).pdfNombre;
  //var fullpath = './documents' +  nombrePDF;
  var fullpath = './documents' +  pathname;



  var file = fs.createReadStream(fullpath);
  var stat = fs.statSync(fullpath);
  response.setHeader('Content-Length', stat.size);
  response.setHeader('Content-Type', 'application/pdf');

  if (pathname == "/Casos-y-hallazgos-in.pdf")
    response.setHeader('Content-Disposition', 'attachment; filename=Casos-y-hallazgos-in.pdf');
  else if (pathname == "/CaracteristicasPersonalidad.pdf")
    response.setHeader('Content-Disposition', 'attachment; filename=CaracteristicasPersonalidad.pdf');
  file.pipe(response);


}



function cssContent(response,postData, pathname){

	var fullpath = './public' + pathname;

	console.log("Request handler 'cssContent' was called. The file " + fullpath + " was requested.");

	fs.readFile(fullpath, null, function (error,data){

		if (error){
			console.log("No file found at:" + fullpath);
			response.writeHead(404);
			response.write('File not found!');
		} else{
			response.writeHead(200, {"Content-Type": "text/css"});
			response.write(data);
		}

		response.end();

	});


}

function jsContent(response,postData, pathname){
	console.log("Request handler 'jsContent' was called. The file " + pathname + " was requested.");

	var fullpath = './public' + pathname;

	fs.readFile(fullpath, null, function (error,data){

		if (error){
			console.log("No file found at:" + fullpath);
			response.writeHead(404);
			response.write('File not found!');
		} else{
			response.writeHead(200, {"Content-Type": "text/javascript"});
			response.write(data);

		}

		response.end();

	});
}

function pngContent(response,postData, pathname){
	console.log("Request handler 'pngContent' was called. The file " + pathname + " was requested.");

	var fullpath = './public' + pathname;

	fs.readFile(fullpath, null, function (error,data){

		if (error){
			console.log("No file found at:" + fullpath);
			response.writeHead(404);
			response.write('File not found!');
		} else{
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(data);
		}

		response.end();

	});
}


//Views de la app web
exports.homePage = homePage;
exports.infoPage = infoPage;
exports.loginPage = loginPage;
exports.uploadPage = uploadPage;

//Acciones o servicios que el usuario solicita manualmente
exports.loginAction = loginAction;
exports.logoutAction = logoutAction;
exports.piServiceEssay = piServiceEssay;
exports.piServiceTwitter = piServiceTwitter;
exports.pdfService = pdfService;
exports.lastProfile = lastProfile;
exports.fullReportJson = fullReportJson;

//Acciones o servicios que el cliente solicita automaticamente
exports.cssContent = cssContent;
exports.jsContent = jsContent;
exports.pngContent = pngContent;
