const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');
const csv = require('csv-parser');
var filename = "final.csv";
var logsfolder  = "logs";

const app = express();
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static('static'));
app.use(express.urlencoded({extended:true}));

if(process.env.debug=="1"){
	console.log("App inciada correctamente, leyendo CSV...");
	console.log("Se ha detectado el modo de debugging, se mostrarán logs adicionales.");
}
var file = [];
var errors = [];
var base = [];
if (!fs.existsSync(logsfolder))fs.mkdirSync(logsfolder);
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
	for(const i in file){
		file[i].StopWords = file[i].StopWords.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").replace(/[!#$%&=?¿\[\]¡*¨´{}+-]/g,'').split(/[\s,;:._\/\(\)\"\'-]+/);
		base.push({nombre:file[i].Canciones,album:file[i].Album,linkhttp:file[i].AudioPrueba,linkcover:file[i].CoverArt,cant:[]});
	}
	if(process.env.debug=="1") console.log("Lectura completada, ejecutando server...");
	app.listen(80, () => {
		if(process.env.debug=="1") console.log('Server en puerto 80');
		else console.log("Listo! La página web ya está funcionando en el puerto 80");
	}).on("error", function(err){
        if(err.errno === 'EADDRINUSE') {
			if(process.env.debug=="1") console.log("Error! El puerto 80 está ocupado, usando puerto alternativo (8080)");
			app.listen(8080, () => {
				if(process.env.debug=="1") console.log('Server en puerto 8080');
				else console.log("Listo! La página web ya está funcionando en el puerto 8080 (el 80 estaba ocupado)");
			}).on("error", function(err){
				if(err.errno === 'EADDRINUSE') {
					if(process.env.debug=="1") console.log("Error! El puerto 8080 también está ocupado, no se udará ningún puerto");
					else console.log("Error! Los puertos 80 y 8080 están ocupados. No se usará ninguna página web, pero el script se mantendrá activo.");
				} else {
					console.log("Error inesperado de red! No se pudieron usar los puertos 80 ni 8080. No se usará ninguna página web, pero el script se mantendrá activo.");
					console.error(err);
				}
			});
        } else {
			console.log("Error inesperado de red! No se puedo usar el puerto 80. No se usará ninguna página web, pero el script se mantendrá activo.");
            console.error(err);
        }
	});
});

app.get('/', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.render("main",{ layout: 'home' });
});

app.post('/', (req, res) => {
	if(logsfolder){
		fs.writeFile(logsfolder+("/Save "+(req.header('x-forwarded-for') || req.connection.remoteAddress)+" "+new Date().toLocaleString()).replace(/:/g,"-")+".json", JSON.stringify(req.body), function (err) {
			if (err){
				console.log("Error al guardar el archivo de logs (la ejecución continuará normlmente):");
				console.error(err);
			}
		});
	}
	var out = JSON.parse(JSON.stringify(base));
	var words = [];
	for(const q in req.body){
		words.push(...(req.body[q].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").replace(/[!#$%&=?¿\[\]¡*¨´{}+-]/g,'').split(/[\s,;:._\/\(\)\"\'-]+/)));
	}
	for(const o in file){
		for(const p in file[o].StopWords){
			for(const i in words){
				if(file[o].StopWords[p]==words[i] || (words[i].startsWith(file[o].StopWords[p]) && words[i].length>3)){
					out[o].cant.push(file[o].StopWords[p].toLowerCase());
				}
			}
		}
	}
	out = out.filter((v) => v.cant.length > 0);
	out.sort(function ( a, b ){ return b.cant.length - a.cant.length; });
	out = out.slice(0,5);
	for(const i in out){
		out[i].cant = Array.from(new Set(out[i].cant));
		out[i].cant = out[i].cant.join(", ");
	}
	if(out[0])out[0].size = "50";
	if(out[1])out[1].size = "42";
	if(out[2])out[2].size = "34";
	if(out[3])out[3].size = "26";
	if(out[4])out[4].size = "20";
	res.setHeader('Content-Type', 'text/html');
	res.render("out",{ layout: 'home', array: out});
});
if(process.env.debug=="1"){
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
				file[i].StopWords = file[i].StopWords.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").replace(/[!#$%&=?¿\[\]¡*¨´{}+-]/g,'').split(/[\s,;:._\/\(\)\"\'-]+/);
				base.push({nombre:file[i].Canciones,album:file[i].Album,linkhttp:file[i].AudioPrueba,linkcover:file[i].CoverArt,cant:[]});
			}
			console.log("Lectura completada!");
			res.redirect("/csv");
		});
	});
}