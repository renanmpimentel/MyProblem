var EventEmitter = process.EventEmitter,
	emitter = new EventEmitter();


function GerenciadorAlteracao() {
	this.problemasAlteracao = {};
}

GerenciadorAlteracao.prototype.adicionarAlterador = function (idProblema) {
	console.log('adicionando contador');
	if(this.problemasAlteracao[idProblema]) {
		this.problemasAlteracao[idProblema] ++;
	} else {
		this.problemasAlteracao[idProblema] = 1;
	}
}

GerenciadorAlteracao.prototype.removerAlterador = function (idProblema) {
	console.log('removendo contador '+idProblema);
	if(this.problemasAlteracao[idProblema]) {
		this.problemasAlteracao[idProblema] --;
		if(this.problemasAlteracao[idProblema] == 0) {
			emitter.emit('overSockets', {msg : '0 sockets'});
		}
	}
}

module.exports = GerenciadorAlteracao;