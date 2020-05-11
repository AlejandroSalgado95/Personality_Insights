# Personality_Insights

Descripcion:
Aplicación web que incorpora el servicio de Personality Insights de IBM, proyecto desarrollado en Mostla para el Centro de Inteligencia para la Educación.

## Notas:
- La API del servicio Personality Insights de IBM fue actualizada en Octubre 2019. Se ha desabilitado la llamada a la API en la aplicación hasta incorporar los cambios necesarios para consultar la API (el análisis de personalidad por ensayo y por cuenta de twitter están deshabilitados).
- Para visualizar los resultados del analisis de personalidad arrojado por la API del servicio Personality Insights de IBM, ingresar con la cuenta: a.salgado.gaspar@gmail.com

## Manual de  uso:
- Entrar con cualquier correo y dar click en entrar
- Una vez ingresado, la sesion dura 30 minutos. Mas tardar de eso, sera necesario ingresar de nuevo en la aplicacion web.
- En la pagina a la que se acaba de ingresar, seguir una de las siguientes dos opciones:
  1) Copiar y pegar un ensayo de al menos 5000 palabras y dar click en "Analizar"
  2) Dar click en el boton "Analisis por twitter", para despues escribir la cuenta de twitter que desea que se analice y el idioma en que
     desea que los tweets de dicha cuenta sean considerados (nota: los tweets de dicho usuario en cualquier otro idioma diferente al      
     especificado son descartados del analisis)
- Será llevado a una pagina con el desglose del analisis de personalidad del autor del ensayo o cuenta de twitter analizado. Estos 
  analisis son guardados en la base de datos de la aplicacion web para posteriores consultas, esto con el correo mediante el cual se
  ingreso a la aplicacion (no el autor ni la cuenta de twitter que se analizo).
- Es posible realizar nuevos analisis si lo desea, pero solo el ultimo analisis realizado sera mostrado en la pagina correspondiente de 
  desgloce del analisis
