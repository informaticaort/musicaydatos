# Proyecto Música y Ciencia de Datos
Proyecto Musica y Ciencia de Datos de Ort.
## Iniciar sitio web
Para copiar el source code, hacer `https://github.com/informaticaort/musicaydatos.git`. Después, correr `npm install` para que se agreguen los node_modules. Por último, hacer `npm start`.
## Acerca de
Este proyecto es una página web que, al contarle un poco sobre uno, te recomienda una canción de la banda **El Cuarteto de Nos**. Al entrar en el sitio web, se deben responder ocho preguntas y dos multiple choice (no obligatorios). En base a estos, la página obtiene tus gustos, y te relaciona con una canción de la banda.

Para lograr esto, se tuvo que crear una base de datos con los puntos clave de las canciones, o sea, sus palabras más importantes y repetidas. Después, ese archivo se carga directamente en el código del sitio web, que se encarga de buscar las palabras introducidas en las palabras clave de las cien canciones cargadas en el archivo.

Finalmente, este también se encarga del diseño gráfico de la página, así como también de la forma de mostrar las preguntas y las canciones elegidas (con sus miniaturas y vista previa), estando desarrollado especialmente para además soportar facilmente futuras mejoras.
### Tecnologias usadas
* Armado de la base de datos: Python3, Spotipy, Jupyter Notebooks y CSV.
* Análisis de datos y montaje de la página web: Node.js, ExpressJS, HTML+CSS, Handlebars Templating y CSV parser.
## Páginas (rutas) del sitio
### / (GET)
Inicio del sitio con las preguntas, devuelve HTML.
### / (POST)
Procesa la lista de palabras y muestra las canciones, devuelve HTMl.
### /csv (GET)
Muestra el csv cargado en formato JSON (pero dentro del sitio, es un log, no debe usarse como api), devuelve HTML. Funciona solo en el modo de debugging.
### /reload (GET)
Recarga el csv. Útil para entornos de testeo, por ejemplo, si es modificado constantemente. Si se completa correctamente, redirecciona a /csv. Funciona solo en el modo de debugging.
## Modo de debugging
Para activar el modo de debug (que habilita las páginas /csv y /reload), ejecutar `debug=1 npm start` en Linuxy y Mac para iniciar. En Windows, ejecutar `set debug=1` y después `npm start`, y se va a mantener activado hasta que se ejecute `set debug=0`.