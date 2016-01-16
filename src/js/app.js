angular.module('app', ['ui.router', 'templates'])		
.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider
	.state('app', {
        url: "/",
        abstract: true,
        templateUrl: "layout.html"
    })
	.state('app.game', {
		url: "",
		templateUrl: "game.html",
		controller: 'GameController'
	});
}]);
