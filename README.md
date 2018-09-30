# Personality_Insights

Descripcion:
Aplicación web que incorpora el servicio de Personality Insights de IBM, proyecto desarrollado en Mostla para el Centro de Inteligencia

Modo de  uso:
-Entrar con cualquier correo y dar click en entrar
-En la pagina a la que se acaba de ingresar, seguir una de las siguientes dos opciones:
  1) Copiar y pegar un ensayo de al menos 5000 palabras y dar click en "Analizar"
  2) Dar click en el boton "Analisis por twitter", para despues escribir la cuenta de twitter que desea que se analice y el idioma en que
     desea que los tweets de dicha cuenta sean considerados (nota: los tweets de dicho usuario en cualquier otro idioma diferente al      
     especificado son descartados del analisis)
- Será llevado a una pagina con el desglose del analisis de personalidad del autor del ensayo o cuenta de twitter analizado. Estos 
  analisis son guardados en la base de datos de la aplicacion web para posteriores consultas, esto con el correo mediante el cual se
  ingreso a la aplicacion (no el autor ni la cuenta de twitter que se analizo).
- Es posible realizar nuevos analisis si lo desea, pero solo el ultimo analisis realizado sera mostrado en la pagina correspondiente de 
  desgloce del analisis
