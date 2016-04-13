(function () {

	'use strict';

	angular.module('app')
		.controller('NavController', NavController);

	function NavController($state) {

		'ngInject';

		let vm = this;
		vm.onNewGameClicked = onNewGameClicked;
		
		function onNewGameClicked(){
			$state.transitionTo($state.current, {}, { reload: true, inherit: false, notify: true });
		}
		
	}
})();
