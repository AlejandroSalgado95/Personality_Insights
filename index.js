//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Proposito de este modulo: inicializar todo el codigo backend necesario para que la aplicacion web arranque y funcione
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//yey

var server = require("./server"); //Modulo que se encarga de recibir con integridad un request (header del request y su contenido via metodo Post o Get) del cliente, para despues entregarselo al modulo 'router'
var router = require("./router"); //Modulo que se encarga de averiguar qué recurso o accion esta solicitando el cliente para determinar a qué funcion encomendarle atender la solicitud del cliente
var requestHandlers = require("./requestHandlers"); //Modulo que contiene todas las funciones necesarias para despachar cualquier recurso (html,css,js,pdf,etc) o servicio (IBM PI, login, logout,etc) solicitado por un cliente


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Arreglo asociativo que almacena funciones
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var handle = {}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funciones para entregar views (archivos html) de la app web
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

handle["/"] = requestHandlers.loginPage; //Pagina para iniciar sesion
handle["/Autenticacion"] = requestHandlers.loginPage; //Pagina para iniciar sesion
handle["/Informacion"] = requestHandlers.infoPage; //Pagina que contiene información ilustrativa
handle["/Inicio"] = requestHandlers.homePage; //Pagina donde se muestra con graficas el analisis de personalidad del usuario
handle["/Subir"] = requestHandlers.uploadPage; //Pagina en donde se sube el ensayo que el usuario quiera analizar



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funciones para realizar acciones o servicios
//Nota: Estos son solicitados de manera manual por el usuario
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
handle["/LoginAction"] = requestHandlers.loginAction; //Iniciar sesion (guardar una cookie)
handle["/LogoutAction"] = requestHandlers.logoutAction; //Terminar sesion (borrar dicha cookie)
handle["/PIServiceEssay"] = requestHandlers.piServiceEssay; //Analizar un ensayo provisto por el usuario con el servicio de Personality Insights de IBM y guardarlo en un servidor MySQL
handle["/PIServiceTwitter"] = requestHandlers.piServiceTwitter; //Analizar una cuenta de Twitter con el servicio de Personality Insights de IBM y guardarlo en un servidor MySQL
handle["/LastProfile"] = requestHandlers.lastProfile; //Obtener de un servidor MySQL el ultimo analisis realizado por el usuario
handle["/FullReportJson"] = requestHandlers.fullReportJson;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funciones para entregar una variedad de archivos (css,js,png,pdf,etc)  al cliente
//Nota: Estos son solicitados de manera automatica por el cliente
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
handle["/css"] = requestHandlers.cssContent;
handle["/js"]= requestHandlers.jsContent;
handle["/png"]= requestHandlers.pngContent;
handle["/pdf"]= requestHandlers.pdfService;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Se le encomienda al servidor la tarea de arrancar y estar escuchando solicitudes (requests) de usuarios, ya sea que soliciten recursos o acciones
//Nota:se le hace entrega al servidor del modulo 'router' y el arreglo de funciones
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
server.start(router.route, handle);
