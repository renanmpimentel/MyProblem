var redis = require('redis').createClient();
var problemaModel = require('../models/problema');

var setProblema = function (problema, callback) {
	console.log('alterando problema no redis '+JSON.stringify(problema));
	redis.hgetall('problema:'+problema._id,function (err, oldProblema) {
		console.log('  GetAll '+JSON.stringify(oldProblema));
		if(!oldProblema){
			callback(new Error('Problema não encontrado. O mesmo deve existir para ser alterado.'));
			return;
		}
		redis.hmset('problema:'+problema._id,'descricao',problema.descricao, callback);
	});
}

var retornarDadosParaModelos = function () {
	redis.smembers('problemas', function(err, problemas) {

		problemas.forEach(function (idProblema) {
			var descricao;
			redis.get('problema:'+idProblema, function (err, desc) {
				descricao = desc;
			});
			problemaModel.update(id, {descricao : descricao});
		});

		redis.del('problemas');
	});
};

var getProblema = function(id, callback) {
	redis.hgetall('problema:'+id, function (err, problemaRedis) {
		if(err) {
			console.log(err);
			callback(err);
			return;
		}

		if(problemaRedis) {
			callback(null, problemaRedis);
			return;
		}

		problemaModel.findById(id, function (err, problem) {
			if(problem) {
				redis.hmset('problema:'+id, 'descricao', problem.descricao, '_id',problem._id,
					 'responsavel', problem.responsavel, function (err, msg) {
						redis.sadd('problemas', id);
						callback(null, problem);	 	
					 } );				
				return;
			}

			callback(new Error('Problema não encontrado;', null));
		});
		
	});
}

var atualizar = function (id) {
	redis.get('problema:'+id, function(err, desc) {
		if(desc) {
			problemaModel.update(id, {descricao : descricao}, function (err, data) {
				redis.srem('problemas', id);
			});			
		}
	});
}

exports.atualizar = atualizar;
exports.setProblema = setProblema;
exports.getProblema = getProblema;