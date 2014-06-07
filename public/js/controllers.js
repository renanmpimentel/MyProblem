var controllers = angular.module('controllers', []);

controllers.controller('loginCtrl', ['$scope','$http', '$window', '$location',
	function ($scope, $http, $window, $location) {

	var autenticar = function () {
		$http.post('/public/login/authenticate', $scope.usuario)
			.success(function (data, status) {
				console.log(data);
				$window.sessionStorage.token = data.token;
				$window.sessionStorage.usuario = JSON.stringify(data.usuario);
				$location.path('/problemas');
			})
			.error( function (data, status) {
				console.log('erro ao autenticar: '+data+'. Status: '+status);
				alert(data);
				$scope.usuario = {};
			});
	}
	
	$scope.autenticar = autenticar;
}]);

controllers.controller('problemaCtrl', ['$scope','$window', '$http', 
	function ($scope, $window, $http) {

		function getNovoProblema() {
			return {
				descricao : '',
				responsavel : JSON.parse( $window.sessionStorage.usuario ).nome
			}
		}

		$scope.problema = getNovoProblema();

		var findAll = function () {
			$http.get('/protected/api/problema')
				.success(function (problemas, status) {
					$scope.problemas = problemas;
				})
				.error(function (data, status) {
					console.log(data+'. Status '+status);
				});
		}

		var enviar = function () {
			$http.post('/protected/api/problema', $scope.problema)
				.success(function (problema, status) {
					$scope.problemas.push(problema);
					$scope.problema = getNovoProblema();;
				})
				.error(function (data, status) {
					console.log(data+'. status '+status);
				});
		}

		$scope.findAll = findAll;
		$scope.enviar = enviar;
	}]);

controllers.controller('MainCtrl', ['$scope','$window', '$location',
	function ($scope, $window, $location) {
		var logout = function () {
			delete $window.sessionStorage.token;
			delete $window.sessionStorage.usuario;
		 	$location.path('/');
			console.log($location);
		}

		$scope.logout = logout;
	}]);

controllers.controller('desenvCtrl', ['$scope','$window', '$location','$routeParams', '$route', 'socket',
	function ($scope, $window, $location, $routeParams, $route, socket) {
		console.log('carregando controller desenv');

		// var iniciarConexao = function () {
		// 	//$route.reload();
		// 	var socket = io.connect();
		// 	console.log(socket);
		// 	$scope.$on('$locationChangeStart', function (event) {
		// 		socket.disconnect();
		// 	});
		// }

		var iniciarConexao = function () {
			$scope.problema = {};
			console.log('iniciando conexão para problema '+$routeParams.id)

			$scope.$on('$locationChangeStart', function (event) {
				socket.emit('exit', {msg : 'saindo'});
			});

			socket.on('problemaChanged', function (data) {
				console.log('recebendo problema '+JSON.stringify(data));
				$scope.problema = data;
			});

			socket.emit('init', {idProblema : $routeParams.id});
		}

		var enivarDescricao = function () {
			console.log('alterando e enviando problema');
			socket.emit('setproblema', $scope.problema);
		}

		$scope.iniciarConexao = iniciarConexao;
		$scope.enivarDescricao = enivarDescricao;
	}]);