const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');
const csv = require('csv-parser');
var filename = "final.csv";

const app = express();
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static('static'));
app.use(express.urlencoded({extended:true}));

console.log("App inciada correctamente, leyendo CSV...");
var file = [];
var errors = [];
var base = [];
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
		file[i].StopWords = file[i].StopWords.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").replace(/[!\(\)#_$.,\"\'%\/&\s=?¿\[\]¡*¨´{}+-]/g,'').split(";");
		base.push({nombre:file[i].Canciones,album:file[i].Album,linkhttp:file[i].Link,cant:0});
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
	var out = JSON.parse(JSON.stringify(base));
	var words = [];
	for(const q in req.body){
		words.push(...(req.body[q].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").replace(/[!#$%&=?¿\[\]¡*¨´{}+-]/g,'').split(/[\s,._\/\(\)\"\'-]+/)));
	}
	for(const o in file){
		for(const p in file[o].StopWords){
			for(const i in words){
				if(file[o].StopWords[p]==words[i] || (file[o].StopWords[p].includes(words[i]) && words[i].length>3)){
					out[o].cant++;
				}
			}
		}
	}
	out = out.filter((v) => v.cant > 0);
	out.sort(function ( a, b ){ return b.cant - a.cant; });
	out = out.slice(0,5);
	if(out[0])out[0].size = "50";
	if(out[1])out[1].size = "40";
	if(out[2])out[2].size = "30";
	if(out[3])out[3].size = "20";
	if(out[4])out[4].size = "10";
	res.setHeader('Content-Type', 'text/html');
	res.render("out",{ layout: 'home', array: out});
});

app.get('/csv', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.render("csvout",{layout: 'home',file:JSON.stringify(file),errors:JSON.stringify(errors)});
});
app.get('/reload', (req, res) => {
	console.log("Releyendo csv");
	file = [];
	errors = [];
	fs.createReadStream(filename)
	.pipe(csv())
	.on('data', function(data){
		try {
			file.push(data);
		}
		catch(err) {
			errors.push(err);
		}
	}).on('end',function(){
		base = [];
		for(const i in file){
			file[i].StopWords = file[i].StopWords.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").replace(/[!#$%&=?¿\[\]¡*¨´{}+-]/g,'').split(";");
			base.push({nombre:file[i].Canciones,album:file[i].Album,linkhttp:file[i].Link,cant:0});
		}
		console.log("Lectura completada!");
		res.redirect("/csv");
	});
});