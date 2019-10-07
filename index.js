const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');
const csv = require('csv-parser');

const filename = "data1.csv";
const app = express();
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static('static'));
app.use(express.urlencoded({extended:true}));

console.log("App inciada correctamente, leyendo CSV...");
var file = [];
var errors = [];
var data = [];
fs.createReadStream(filename)
.pipe(csv({ separator: ',' }))
.on('data', function(data){
	try {
		file.push(data);
	}
	catch(err) {
		errors.push(err);
	}
})
.on('end',function(){
	for(var i in file){
		file[i].palabras = file[i].palabras.toUpperCase().split(";");
		data.push({nombre:file[i].nombre,cant:0});
	}
	console.log("Lectura completada, ejecutando server...");
	app.listen(80, () => {
		console.log('Server en puerto 80')
	});
});

app.get('/', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.render("main",{ layout: 'home' });
});

app.post('/', (req, res) => {
	var words = req.body.words.toUpperCase().split(",");
	var out = data.slice();
	for(const o in file){
		for(const p in file[o].palabras){
			for(const i in words){
				if(file[o].palabras[p]==words[i] || (file[o].palabras[p].includes(words[i]) && words[i].length>3)){
					out[o].cant++;
				}
			}
		}
	}
	out = out.filter((v) => v.cant > 0);
	out.sort(function ( a, b ){ return b.cant - a.cant; });
	res.setHeader('Content-Type', 'text/html');
	res.render("out",{ layout: 'home', array: out});
	//hacer más lindo el template, poner la primera grande, etc
	//POR ALGUNA RAZÓN DATA SE ESTÁ PASANDO POR REFERENCIA, Y SE VA SUMANDO A ESE
});

app.get('/csv', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.render("csvout",{layout: 'home',file:JSON.stringify(file),errors:JSON.stringify(errors)});
});
app.get('/reload', (req, res) => {
	console.log("Releyendo csv");
	file = [];
	errors = [];
	fs.createReadStream("data1.csv")
	.pipe(csv())
	.on('data', function(data){
		try {
			file.push(data);
		}
		catch(err) {
			errors.push(err);
		}
	}).on('end',function(){
		for(const i in file){
			file[i].palabras = file[i].palabras.split(";");
		}
		console.log("Lectura completada!");
		res.redirect("/csv");
	});
});