const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
//app.set('view options', { layout: 'home' });
app.use(express.static('static'));

console.log("App inciada correctamente, leyendo CSV...");
var file = [];
var errors = [];
fs.createReadStream("data1.csv")
.pipe(csv())
.on('data', function(data){
	try {
		file.push(data);
	}
	catch(err) {
		errors.push(err);
	}
})
.on('end',function(){
	console.log("Lectura completada, ejecutando server...");
	app.listen(80, () => {
		console.log('Server en puerto 80')
	});
});

app.get('/', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.render("main",{ layout: 'home' });
});

app.get('/csv', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.render("csvout",{layout: 'home',file:JSON.stringify(file),errors:JSON.stringify(errors)});
});