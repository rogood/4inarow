(function () {

	'use strict';

	angular.module('app')
		.controller('GameController', GameController);

	function GameController($timeout, Game, HumanPlayer, AutomatedPlayer, messageService) {

		'ngInject';

		let _game = new Game({ moveDelay: 1000, rowCount: 6, colCount: 7, winningCount: 4 }),
			_messages = messageService.getMessages();

		let vm = this;
		vm.colIndices = [];
		vm.rowIndices = [];
		vm.message = {};
		vm.playerCache = _game.getPlayerCache();

		vm.getCurrentPlayer = _game.getCurrentPlayer;
		vm.getGrid = _game.getGrid;
		vm.resetGame = _game.reset;
		
		activate();

		function activate() {
			
			_game.registerPlayer(new HumanPlayer(1, "smiley", { isUser: true }));
			_game.registerPlayer(new AutomatedPlayer(2, "rage"));
			//_game.registerPlayer(new AutomatedPlayer(3, "red"));
			
			resizeGame();

			_game.start();
		}

		function setEventHandlers() {
			_game.onGameEnd(function (winningPlayer, chains) {

				if (!winningPlayer) {
					vm.message = _messages["tie"];
					vm.infoBarIcon = "disc-style-open_hands";
				}
				else if (winningPlayer.isUser) {
					vm.message = _messages["youWin"];
					vm.infoBarIcon = "disc-style-thumbsup";
				}
				else {
					vm.message = _messages["youLose"];
					vm.infoBarIcon = "disc-style-thumbsdown";
				}

			});

			_game.onIllegalMove(function (player) {

				if (player.isUser) {
					vm.message = _messages["cannotMove"];
				}

			});

			_game.onPlayerChange(function (player) {

				if (player) {
					_messages["playerMove"].setMessage(player);
					vm.message = _messages["playerMove"];

					vm.infoBarIcon = player.discStyle;
				}

			});
		}

		function setIndices() {
			for (let i = _game.colCount - 1; i >= 0; i--) {
				vm.colIndices.unshift(i);
			}

			for (let i = _game.rowCount - 1; i >= 0; i--) {
				vm.rowIndices.push(i);
			}

		}
	
		// This resizes the grid so that is appears as large as possible while still keeping square cells.
		function resizeGame() {
			$timeout(function () {
				let gridBodyElem = document.getElementById("game-grid"),
					cellElems = gridBodyElem.querySelectorAll('th, td'),
					containerWidth = document.body.clientWidth - 10,
					containerHeight = document.body.clientHeight - gridBodyElem.getBoundingClientRect().top - 25,
					cellSize;

				if (containerWidth < containerHeight) {
					cellSize = containerWidth / _game.colCount;
				}
				else {
					cellSize = containerHeight / (_game.rowCount + 1);
				}

				for (let i = 0; i < cellElems.length; i++) {
					cellElems[i].style.width =
					cellElems[i].style.height =
					cellSize + "px";
				}
			});
		}

	};
})();
