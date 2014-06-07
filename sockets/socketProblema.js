module.exports = function (server) {
	var io = require('socket.io').listen(server);	
	var problemaService = require('../service/problemaService');
	var GerenciadorAlteracao = require('../businesModel/GerenciadorAlteracao');
	var gerenciadorAlt = new GerenciadorAlteracao();

	io.sockets.on('connection', function (socket) {
		console.log('socket conectado');

		socket.on('join', function(idProblema) {
			socket.set('idProblema', idProblema);		
			gerenciadorAlt.adicionarAlterador(idProblema);
		});

		socket.on('setproblema', function (problema) {
			console.log('Socket.setProblema.'+JSON.stringify(problema));
			problemaService.setProblema(problema, function(err) {
				socket.broadcast.emit('problemaChanged',{descricao : problema.descricao});
			});
		});

		socket.on('disconnect', function() {
		});

		socket.on('init', function (data) {
			socket.set('idProblema', data.idProblema);		
			gerenciadorAlt.adicionarAlterador(data.idProblema);

			problemaService.getProblema(data.idProblema, function (err, problema) {
				console.log('getProblema. Enviando problema '+ JSON.stringify(problema));
				socket.emit('problemaChanged', problema);
			});
		})

		socket.on('exit', function (data) {
			console.log('Exit disparado');
			gerenciadorAlt.removerAlterador(data.idProblema);
		});

	});
}