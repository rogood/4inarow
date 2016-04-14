(function () {

	'use strict';

	angular.module('app')
		.service('gameService', gameService);

	function gameService($timeout, Game, HumanPlayer, AutomatedPlayer, messageService) {

		'ngInject';

		let _game;
		let _messages = messageService.getMessages();

		let gameService = {
			getColIndices: getColIndices,
			getGame: getGame,
			getRowIndices: getRowIndices,
			init: init,
			resizeGame: resizeGame,
			setInfoBarOnGameEnd: setInfoBarOnGameEnd,
			setInfoBarOnIllegalMove: setInfoBarOnIllegalMove,
			setInfoBarOnPlayerChange: setInfoBarOnPlayerChange
		};

		return gameService;

		function init(options) {
			
			if(_game){
				_game.reset();
			}
			
			_game = new Game({ moveDelay: 1000, rowCount: 6, colCount: 7, winningCount: 4 });

			_game.registerPlayer(new HumanPlayer(1, "smiley", { isUser: true }));
			_game.registerPlayer(new AutomatedPlayer(2, "rage"));
			//_game.registerPlayer(new AutomatedPlayer(3, "red"));
			
			_game.onGameEnd(options.onGameEnd);
			_game.onIllegalMove(options.onIllegalMove);
			_game.onPlayerChange(options.onPlayerChange);
		}

		function getGame() {
			return _game;
		}

		function getColIndices() {

			let colIndices = [];

			for (let i = _game.colCount - 1; i >= 0; i--) {
				colIndices.unshift(i);
			}

			return colIndices;
		}

		function getRowIndices() {

			let rowIndices = [];

			for (let i = _game.rowCount - 1; i >= 0; i--) {
				rowIndices.push(i);
			}

			return rowIndices;
		}

		function resizeGame() {
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
		}

		function setInfoBarOnPlayerChange(infoBar, player) {
			if (player) {

				_messages.playerMove.setMessage(player);

				infoBar.message = _messages.playerMove;
				infoBar.icon = player.discStyle;
			}
		}

		function setInfoBarOnIllegalMove(infoBar, player) {

			if (player.isUser) {
				infoBar.message = _messages.cannotMove;
			}
		}

		function setInfoBarOnGameEnd(infoBar, winningPlayer) {

			if (!winningPlayer) {
				infoBar.message = _messages.tie;
				infoBar.icon = "disc-style-open_hands";
			}
			else if (winningPlayer.isUser) {
				infoBar.message = _messages.youWin;
				infoBar.icon = "disc-style-thumbsup";
			}
			else {
				infoBar.message = _messages.youLose;
				infoBar.icon = "disc-style-thumbsdown";
			}

		}
	}
})();
