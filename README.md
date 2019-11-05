# Proyecto Música y Ciencia de Datos
Proyecto Musica y Ciencia de Datos de Ort.
## Iniciar sitio web
Para copiar el source code, hacer `https://github.com/informaticaort/musicaydatos.git`. Después, correr `npm install` para que se agreguen los node_modules. Por último, hacer `npm start`.
## Páginas (rutas) actuales
### / (GET)
Inicio del sitio con las preguntas, devuelve HTML.
### / (POST)
Procesa la lista de palabras y muestra las canciones, devuelve HTMl.
### /csv (GET)
Muestra el csv cargado en formato JSON (pero dentro del sitio, es un log, no debe usarse como api), devuelve HTML.
### /reload (GET)
Recarga el csv. Útil para entornos de testeo, por ejemplo, si es modificado constantemente. Si se completa correctamente, redirecciona a /csv.
