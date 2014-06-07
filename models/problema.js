var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//require('./mongoConnection');

var ProblemaSchema = new Schema({
	descricao : {type : String, default : ''},
	dataCriacao : {type : Date, default : Date.now},
	responsavel : {type : String, default : String}
});

var Model = mongoose.model('Problema', ProblemaSchema);

var create = function (problema, callback) {
	var novoProblema = new Model(problema);

	novoProblema.save(function (err, problemaSalvo) {
		callback(err, problemaSalvo);
	});
}

var findAll = function (callback) {
	Model.find({}, function (err, problemas) {
		callback(err, problemas);
	});
}

var update = function (id, problemaAlteracao, callback) {
	Model.update({_id : id}, problemaAlteracao, function(err, data) {
		callback(err, data);
	});
}

var findById = function (id, callback) {
	Model.findOne({_id : id}, function (err, problema) {
		callback(err, problema);
	});
}

exports.create = create;
exports.findAll = findAll;
exports.findById = findById;
exports.update = update;