var GerenciadorAlteracao = require('../businesModel/GerenciadorAlteracao');
var assert = require('assert');

var ger = new GerenciadorAlteracao();

ger.on('overSocket', function (msg) {
	console.log('sockets acabraram');
});




