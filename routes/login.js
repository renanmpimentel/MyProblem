var express = require('express');
var router = new express.Router();
var usuario = require('../models/usuario');
var secret = require('../conf/secret');
var jwt = require('jsonwebtoken');

function criarAdmin() {

	usuario.findByNomeAndSenha('admin', '123mudar', function (err, usuarioRetorno) {
		if (err) {
			console.log(err);
			return;
		}

		if(usuarioRetorno) {
			console.log('Admin já criado');
			return;
		}

		usuario.create(
			{
				nome : 'admin',
				senha : '123mudar',
				privilegios : ['admin']
			},
			function (err, usuario) {
				if(err) {
					console.log(err);
					return;
				}
				console.log('admin criado'+ usuario);
		});		
	});
}

criarAdmin();

router.get('/', function (req, res) {
	res.render('partials/login');
});

router.post('/authenticate', function (req, res) {
	var data = req.body;

	usuario.findByNomeAndSenha(data.nome, data.senha, function (err, usuarioRetorno) {
		if(!usuarioRetorno) {
			res.send(401, 'usuário ou senha inválido');
			return;
		}

		var token = jwt.sign(usuarioRetorno, secret.key, {expireInMinutes: 5*60} );

		res.json({token : token, usuario : usuarioRetorno});
	});
});

module.exports = router;