var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myProblem');

var db = mongoose.connection;

db.on('error', function (err) {
	console.log(err);
});

db.once('open', function() {
	console.log('Conexão aberta');
});

