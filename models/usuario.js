var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./mongoConnection');

var UsuarioSchema = new Schema({
	nome : {type : String, default : ''},
	privilegios : [String],
	senha : String,
	email : String
});

var Model = mongoose.model('Usuario', UsuarioSchema);

var create = function (usuario, callback) {
	var novoUsuario = new Model(usuario);

	novoUsuario.save(function (err, usuario) {
		if (err) {
			callback(new Error('Erro ao salvar usuário '+err));
		}

		callback(null, usuario);
	});
}

var findByNomeAndSenha = function (nome, senha, callback) {

	Model.findOne({ nome: nome, senha : senha  },{senha : 0}, function (err, usuario) {
		if(err)
			callback(new Error('Erro ao buscar por usuário e senha. '+err) );

		callback(null, usuario);
	} );
}

exports.findByNomeAndSenha = findByNomeAndSenha;
exports.create = create;
exports.Schema = UsuarioSchema;