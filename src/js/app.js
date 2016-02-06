angular.module('app', ['ui.router', 'templates'])		
.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider
	.state('app', {
        url: "/",
        abstract: true,
        templateUrl: "layout.html",
		controller: 'GameController'
    })
	.state('app.game', {
		url: "",
		views:{
			nav:{
				templateUrl: 'gameNav.html'
			},
			main:{
				templateUrl: "game.html"
			}
		}
	});
}]);
