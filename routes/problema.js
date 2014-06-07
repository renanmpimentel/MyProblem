var express = require('express');
var router = new express.Router();
var problema = require('../models/problema');
var problemaService = require('../service/problemaService')


router.post('/', function (req, res) {
	var data = req.body;
	console.log(data);
	
	problema.create(data, function (err, novoProblema) {
		if (err){
			console.log(err);
			return;
		}
		res.json(novoProblema);
	})
});

router.get('/', function (req, res) {
	problema.findAll(function(err, problemas) {
		if(err){
			console.log(err);
			return;
		}
		res.json(problemas);
	});
});

router.get('/:id', function (req, res) {
	problemaService.getProblema(req.params.id, function (err, problema) {
		res.json(problema);
	});
});

module.exports = router;

