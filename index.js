const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();

app.get('/', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	var inputFilePath = "data1.csv";
	var file = [];
	var errors = [];
	fs.createReadStream(inputFilePath)
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
		res.write("<h1>Datos CSV:</h1>");
		res.write(JSON.stringify(file));
		res.write("<h2>Logs de errores:</h2>");
		res.write(JSON.stringify(errors));
		res.end();
	});
});

app.listen(80, () => {
	console.log('Ejecutando en puerto 80')
});