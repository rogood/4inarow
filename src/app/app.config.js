(function () {

	'use strict';

	angular.module('app')
		.config(config);

	function config($stateProvider, $urlRouterProvider) {

		'ngInject';

		$urlRouterProvider.otherwise("/");

		$stateProvider
			.state('app', {
				url: "/",
				abstract: true,
				templateUrl: "layout.html"
			})
			.state('app.game', {
				url: "",
				views: {
					nav: {
						templateUrl: 'nav/nav.html',
						controller: 'NavController',
						controllerAs: 'vm'
					},
					main: {
						templateUrl: "game/game.html",
						controller: 'GameController',
						controllerAs: 'vm'
					}
				}
			});
	}

})();