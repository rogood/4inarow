(function () {

	'use strict';

	angular.module('app')
		.controller('GameController', GameController);

	function GameController($timeout, Game, HumanPlayer, AutomatedPlayer, gameService) {

		'ngInject';

		let vm = this;
		
		vm.colIndices = [];
		vm.rowIndices = [];
		vm.infoBar = {
			icon: null,
			message: { 
				text: null,
				cssClass: null
			}
		};		
		vm.playerCache = () => {};
		vm.getCurrentPlayer = () => {};
		vm.getGrid = () => {};

		activate();

		function activate() {

			gameService.init({
				onPlayerChange: onPlayerChange,
				onIllegalMove: onIllegalMove,
				onGameEnd: onGameEnd
			});
			
			vm.colIndices = gameService.getColIndices();
			vm.rowIndices = gameService.getRowIndices();
			
			let game = gameService.getGame();
			
			vm.playerCache = game.getPlayerCache();
			vm.getCurrentPlayer = game.getCurrentPlayer;
			vm.getGrid = game.getGrid;
			
			resizeGame();
			
			game.start();
		}
		
		function onPlayerChange(player) {
			gameService.setInfoBarOnPlayerChange(vm.infoBar, player);
		}

		function onIllegalMove(player) {		
			gameService.setInfoBarOnIllegalMove(vm.infoBar, player);
		}

		function onGameEnd(winningPlayer) {		
			gameService.setInfoBarOnGameEnd(vm.infoBar, winningPlayer);
		}
	
		// This resizes the grid so that is appears as large as possible while still keeping square cells.
		function resizeGame() {
			$timeout(function () {
				gameService.resizeGame();
			});
		}

	}
})();
