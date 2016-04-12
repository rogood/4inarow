(function () {

	'use strict';

	angular.module('app')
		.controller('NavController', NavController);

	function NavController($state) {

		'ngInject';

		let vm = this;
		vm.onNewGameClicked = onNewGameClicked;
		
		function onNewGameClicked(){
			$state.go("app.game", null, { reload: true });
		}
		
	}
})();
