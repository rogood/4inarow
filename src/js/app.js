(function () {

	'use strict';

	angular.module('app', ['ui.router', 'templates'])
		.config(config);

	function config($stateProvider, $urlRouterProvider) {

		'ngInject';

		$urlRouterProvider.otherwise("/");

		$stateProvider
			.state('app', {
				url: "/",
				abstract: true,
				templateUrl: "layout.html",
				controller: 'GameController',
				controllerAs: 'vm'
			})
			.state('app.game', {
				url: "",
				views: {
					nav: {
						templateUrl: 'gameNav.html'
					},
					main: {
						templateUrl: "game.html"
					}
				}
			});
	}

})();