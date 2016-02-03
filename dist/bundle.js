'use strict';

angular.module('app', ['ui.router', 'templates']).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider.state('app', {
		url: "/",
		abstract: true,
		templateUrl: "layout.html"
	}).state('app.game', {
		url: "",
		templateUrl: "game.html",
		controller: 'GameController'
	});
}]);
'use strict';

angular.module('app').controller('GameController', ['$scope', '$timeout', 'Game', 'HumanPlayer', 'AutomatedPlayer', 'messageService', function ($scope, $timeout, Game, HumanPlayer, AutomatedPlayer, messageService) {
	var i,
	    _game = new Game({ moveDelay: 1000, rowCount: 6, colCount: 7, winningCount: 4 }),
	    _messages = messageService.getMessages();

	// Initialise scope variables
	$scope.colIndices = [];
	$scope.rowIndices = [];

	// These scope variables are set to functions in order to capture
	// internal changes to the properties
	$scope.getCurrentPlayer = _game.getCurrentPlayer;
	$scope.getGrid = _game.getGrid;
	$scope.message = {};

	for (i = _game.colCount - 1; i >= 0; i--) {
		$scope.colIndices.unshift(i);
	}

	for (i = _game.rowCount - 1; i >= 0; i--) {
		$scope.rowIndices.push(i);
	}

	$scope.resetGame = function () {
		_game.reset();
	};

	// Setting up the game
	_game.registerPlayer(new HumanPlayer(1, "smiley", { isUser: true }));
	_game.registerPlayer(new AutomatedPlayer(2, "rage"));
	//_game.registerPlayer(new AutomatedPlayer(3, "red"));

	$scope.playerCache = _game.getPlayerCache();

	_game.onGameEnd(function (winningPlayer, chains) {

		if (!winningPlayer) {
			$scope.message = _messages["tie"];
		} else if (winningPlayer.isUser) {
			$scope.message = _messages["youWin"];
		} else {
			$scope.message = _messages["youLose"];
		}
	});

	_game.onIllegalMove(function (player) {

		if (player.isUser) {
			$scope.message = _messages["cannotMove"];
		}
	});

	_game.onPlayerChange(function (player) {

		if (player) {
			_messages["playerMove"].setMessage(player);
			$scope.message = _messages["playerMove"];
		}
	});

	resizeGame();

	_game.start();

	// This resizes the grid so that is appears as large as possible while still keeping square cells.
	function resizeGame() {
		$timeout(function () {
			var gridBodyElem = document.getElementById("game-grid").getElementsByTagName('tbody')[0],
			    cellElems = gridBodyElem.getElementsByTagName('td'),
			    containerWidth = document.body.clientWidth - 20,
			    containerHeight = document.body.clientHeight - gridBodyElem.getBoundingClientRect().top - 20,
			    cellSize,
			    i;

			if (containerWidth < containerHeight) {
				cellSize = containerWidth / _game.colCount;
			} else {
				cellSize = containerHeight / _game.rowCount;
			}

			for (i = 0; i < cellElems.length; i++) {
				cellElems[i].style.width = cellElems[i].style.height = cellSize + "px";
			}
		});
	}
}]);
'use strict';

angular.module('app').factory('messageService', [function () {
	var _messages = {
		"tie": {
			text: "No more moves can be made. It's a tie",
			cssClass: ""
		},
		"youWin": {
			text: "You win!",
			cssClass: "message-win"
		},
		"youLose": {
			text: "You lose",
			cssClass: "message-lose"
		},
		"cannotMove": {
			text: "Cannot make move",
			cssClass: ""
		},
		"playerMove": {
			text: null,
			cssClass: null,
			setMessage: function setMessage(player) {
				this.cssClass = "player-" + player.id + "-turn";
				this.text = player.isUser ? "It's your turn!" : "I'm making a move...";
			}
		}
	};

	return {
		getMessages: function getMessages() {
			return _messages;
		}
	};
}]);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

angular.module('app').factory('Game', ['$timeout', 'Grid', 'GameValidator', function ($timeout, Grid, GameValidator) {
	var _currentPlayerId = null,
	    _gameValidator = null,
	    _players = [],
	    _playerCache = {},
	    _gridObj = null,
	    _dropTimeout = null,
	    _lastMoveMadeBy = null,
	   

	// Event Handlers
	_onIllegalMove = function _onIllegalMove(playerId) {},
	    _onGameEnd = function _onGameEnd(winningPlayerId) {},
	    _onPlayerChange = function _onPlayerChange(player) {};

	var Game = function () {
		function Game() {
			var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			var _ref$winningCount = _ref.winningCount;
			var winningCount = _ref$winningCount === undefined ? 4 : _ref$winningCount;
			var _ref$moveDelay = _ref.moveDelay;
			var moveDelay = _ref$moveDelay === undefined ? 500 : _ref$moveDelay;
			var _ref$rowCount = _ref.rowCount;
			var rowCount = _ref$rowCount === undefined ? 6 : _ref$rowCount;
			var _ref$colCount = _ref.colCount;
			var colCount = _ref$colCount === undefined ? 7 : _ref$colCount;

			_classCallCheck(this, Game);

			this.winningCount = winningCount;
			this.moveDelay = moveDelay;
			this.rowCount = rowCount;
			this.colCount = colCount;

			_gridObj = new Grid({ rowcount: rowCount, colCount: colCount });
			this.grid = _gridObj.grid;

			_gameValidator = new GameValidator(this.grid, this.colCount, this.rowCount, this.winningCount);
		}

		_createClass(Game, [{
			key: 'onIllegalMove',
			value: function onIllegalMove(callback) {
				_onIllegalMove = callback;
			}
		}, {
			key: 'onGameEnd',
			value: function onGameEnd(callback) {
				_onGameEnd = callback;
			}
		}, {
			key: 'onPlayerChange',
			value: function onPlayerChange(callback) {
				_onPlayerChange = callback;
			}
		}, {
			key: 'getGrid',
			value: function getGrid() {
				return _gridObj.grid;
			}
		}, {
			key: 'getCurrentPlayer',
			value: function getCurrentPlayer() {
				return _playerCache[_currentPlayerId];
			}
		}, {
			key: 'getPlayerCache',
			value: function getPlayerCache() {
				return _playerCache;
			}
		}, {
			key: 'start',
			value: function start() {
				setCurrentPlayer(_players[0]);
			}
		}, {
			key: 'reset',
			value: function reset() {
				$timeout.cancel(_dropTimeout);
				_gridObj.reset();
				_lastMoveMadeBy = null;
				setCurrentPlayer(_players[0]);
			}
		}, {
			key: 'registerPlayer',
			value: function registerPlayer(player) {
				player.setGame(this);
				_playerCache[player.id] = player;
				_players.push(player.id);
			}
		}, {
			key: 'makeMove',
			value: function makeMove(playerId, col) {

				if (_lastMoveMadeBy !== playerId && _gameValidator.isValidMove(_currentPlayerId, playerId, col)) {
					_lastMoveMadeBy = playerId;
					_gridObj.drop(col, playerId);

					checkForGameEnd(playerId, this.moveDelay);

					// The move was made
					return true;
				} else {
					_onIllegalMove(_playerCache[playerId]);

					// The move was not made
					return false;
				}
			}
		}]);

		return Game;
	}();

	function checkForGameEnd(playerId, moveDelay) {

		if (_gameValidator.checkTie()) {
			_onGameEnd(null);
			setCurrentPlayer(null);
		} else {
			var chains = _gameValidator.checkWinner(playerId);
			if (chains) {
				markChains(chains);
				_onGameEnd(_playerCache[playerId], chains);
				setCurrentPlayer(null);
			} else {
				// Timeout to allow for the 1s drop animation
				_dropTimeout = $timeout(function () {
					toggleCurrentPlayer();
				}, moveDelay);
			}
		}
	}

	function markChains(chains) {
		for (var c = 0; c < chains.length; c++) {
			var chain = chains[c].chain;
			for (var i = 0; i < chain.length; i++) {
				var cell = _gridObj.grid[chain[i][0]][chain[i][1]];
				if (cell > 0) {
					_gridObj.grid[chain[i][0]][chain[i][1]] = cell * -1;
				}
			}
		}
	}

	function setCurrentPlayer(playerId) {

		var player = _playerCache[playerId];

		if (playerId) {
			player.onTurnStarted(Game.prototype.makeMove);
		}

		_currentPlayerId = playerId;

		_onPlayerChange(player);
	}

	function toggleCurrentPlayer() {
		setCurrentPlayer(getNextPlayer(_currentPlayerId));
	}

	function getNextPlayer(playerId) {

		var index = _players.indexOf(playerId);

		return index >= 0 && index < _players.length - 1 ? _players[index + 1] : _players[0];
	}

	return Game;
}]);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

angular.module('app').factory('GameValidator', [function () {
	var _grid, _colCount, _rowCount, _winningCount;

	var GameValidator = function () {
		function GameValidator(grid, colCount, rowCount, winningCount) {
			_classCallCheck(this, GameValidator);

			_grid = grid;
			_colCount = colCount;
			_rowCount = rowCount;
			_winningCount = winningCount;
		}

		// Check if move is a winning one

		_createClass(GameValidator, [{
			key: 'checkWinner',
			value: function checkWinner(playerId) {
				var chain,
				    chains = [];

				chain = checkHorizontal(playerId);
				if (chain) {
					chains.push({
						type: "horizontal",
						chain: chain
					});
				}

				chain = checkVertical(playerId);
				if (chain) {
					chains.push({
						type: "vertical",
						chain: chain
					});
				}

				chain = checkDiagonalNE(playerId);
				if (chain) {
					chains.push({
						type: "diagonalNE",
						chain: chain
					});
				}

				chain = checkDiagonalNW(playerId);
				if (chain) {
					chains.push({
						type: "diagonalNW",
						chain: chain
					});
				}

				return chains.length ? chains : false;
			}

			// Check full grid where there is no winner

		}, {
			key: 'checkTie',
			value: function checkTie() {
				var allFull = true;

				for (var i = 0; i < _rowCount; i++) {
					allFull = allFull && _grid[i].length >= _rowCount;
				}

				return allFull;
			}

			// Move Validation

		}, {
			key: 'isValidMove',
			value: function isValidMove(currentPlayer, playerId, col) {
				var isCurrentPlayer = playerId !== null && playerId == currentPlayer;
				var isValidCol = col > -1 && col < _colCount;
				var isColNotFull = _grid[col].length < _rowCount;

				return isCurrentPlayer && isValidCol && isColNotFull;
			}
		}]);

		return GameValidator;
	}();

	function checkHorizontal(playerId) {
		var chain = [];

		for (var r = 0; r < _rowCount; r++) {
			chain.length = 0;
			for (var c = 0; c < _colCount; c++) {
				setChain(chain, c, r, playerId);
			}

			if (chain.length >= _winningCount) {
				return chain;
			}
		}

		return null;
	}

	function checkVertical(playerId) {
		var chain = [];
		for (var c = 0; c < _colCount; c++) {
			chain.length = 0;
			for (var r = 0; r < _grid[c].length; r++) {
				setChain(chain, c, r, playerId);
			}

			if (chain.length >= _winningCount) {
				return chain;
			}
		}

		return null;
	}

	function checkDiagonalNE(playerId) {

		var currCol,
		    currRow,
		    chain = [];

		for (var r = 0; r < _rowCount; r++) {
			currCol = 0;
			currRow = r;
			chain.length = 0;

			while (currCol < _colCount && currRow < _rowCount) {
				setChain(chain, currCol, currRow, playerId);

				currRow++;
				currCol++;
			}

			if (chain.length >= _winningCount) {
				return chain;
			}
		}

		if (chain.length < _winningCount) {
			for (var c = 0; c < _colCount; c++) {
				currCol = c;
				currRow = 0;
				chain.length = 0;

				while (currCol < _colCount && currRow < _rowCount) {
					setChain(chain, currCol, currRow, playerId);

					currRow++;
					currCol++;
				}

				if (chain.length >= _winningCount) {
					return chain;
				}
			}
		}

		return null;
	}

	function checkDiagonalNW(playerId) {

		var currCol,
		    currRow,
		    chain = [];

		for (var c = 0; c < _colCount; c++) {
			currCol = c;
			currRow = 0;
			chain.length = 0;

			while (currCol >= 0 && currRow < _rowCount) {
				setChain(chain, currCol, currRow, playerId);

				currRow++;
				currCol--;
			}

			if (chain.length >= _winningCount) {
				return chain;
			}
		}

		if (chain.length < _winningCount) {
			for (var r = 0; r < _rowCount; r++) {
				currCol = _colCount - 1;
				currRow = r;
				chain.length = 0;

				while (currCol >= 0 && currRow < _rowCount) {
					setChain(chain, currCol, currRow, playerId);

					currRow++;
					currCol--;
				}

				if (chain.length >= _winningCount) {
					return chain;
				}
			}
		}

		return null;
	}

	function setChain(chain, col, row, playerId) {

		if (_grid[col] && _grid[col][row] === playerId) {
			chain.push([col, row]);
		} else if (chain.length < _winningCount) {
			chain.length = 0;
		}
	}

	return GameValidator;
}]);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

angular.module('app').factory('Grid', [function () {
	var Grid = function () {
		function Grid() {
			var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			var _ref$rowCount = _ref.rowCount;
			var rowCount = _ref$rowCount === undefined ? 6 : _ref$rowCount;
			var _ref$colCount = _ref.colCount;
			var colCount = _ref$colCount === undefined ? 7 : _ref$colCount;

			_classCallCheck(this, Grid);

			this.rowCount = rowCount;
			this.colCount = colCount;

			this.grid = [];
			for (var i = 0; i < this.colCount; i++) {
				this.grid.push([]);
			}
		}

		_createClass(Grid, [{
			key: 'reset',
			value: function reset() {
				for (var i = 0; i < this.colCount; i++) {
					this.grid[i].length = 0;
				}
			}
		}, {
			key: 'drop',
			value: function drop(col, playerId) {
				this.grid[col].push(playerId);
			}
		}]);

		return Grid;
	}();

	return Grid;
}]);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

angular.module('app').factory('AutomatedPlayer', ['$timeout', 'Player', function ($timeout, Player) {
	var AutomatedPlayer = function (_Player) {
		_inherits(AutomatedPlayer, _Player);

		function AutomatedPlayer(id, discStyle) {
			var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			var _ref$isUser = _ref.isUser;
			var isUser = _ref$isUser === undefined ? false : _ref$isUser;
			var _ref$delayMax = _ref.delayMax;
			var delayMax = _ref$delayMax === undefined ? 800 : _ref$delayMax;
			var _ref$delayMin = _ref.delayMin;
			var delayMin = _ref$delayMin === undefined ? 200 : _ref$delayMin;

			_classCallCheck(this, AutomatedPlayer);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AutomatedPlayer).call(this, id, discStyle, { isUser: isUser, isAutomated: true }));

			_this.delayMax = delayMax;
			_this.delayMin = delayMin;
			return _this;
		}

		_createClass(AutomatedPlayer, [{
			key: 'onTurnStarted',
			value: function onTurnStarted() {
				var self = this;
				var thinkingTime = this.delayMin + Math.floor(Math.random() * this.delayMax);

				$timeout(function () {
					makeAutomatedMove(self.game, self.id);
				}, thinkingTime);
			}
		}]);

		return AutomatedPlayer;
	}(Player);

	// Private Functions

	function makeAutomatedMove(game, id) {
		var col;

		do {
			col = calculateMove(game.colCount);
		} while (!game.makeMove(id, col));
	}

	// This function is for now just a random number generator.
	// This is the place to insert more intelligent logic later on.
	function calculateMove(colCount) {
		var min = 0;
		var max = colCount - 1;

		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	return AutomatedPlayer;
}]);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

angular.module('app').factory('HumanPlayer', ['Player', function (Player) {
	var HumanPlayer = function (_Player) {
		_inherits(HumanPlayer, _Player);

		function HumanPlayer(id, discStyle) {
			var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			var _ref$isUser = _ref.isUser;
			var isUser = _ref$isUser === undefined ? false : _ref$isUser;

			_classCallCheck(this, HumanPlayer);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(HumanPlayer).call(this, id, discStyle, { isUser: isUser, isAutomated: false }));
		}

		_createClass(HumanPlayer, [{
			key: 'makeMove',
			value: function makeMove(col) {
				this.game.makeMove(this.id, col);
			}
		}]);

		return HumanPlayer;
	}(Player);

	return HumanPlayer;
}]);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

angular.module('app').factory('Player', [function () {
	var Player = function () {
		function Player(id, discStyle) {
			var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			var _ref$isUser = _ref.isUser;
			var isUser = _ref$isUser === undefined ? false : _ref$isUser;
			var _ref$isAutomated = _ref.isAutomated;
			var isAutomated = _ref$isAutomated === undefined ? true : _ref$isAutomated;

			_classCallCheck(this, Player);

			this.id = id;
			this.isUser = isUser;
			this.isAutomated = isAutomated;
			this.game = null;
			this.discStyle = "disc-style-" + discStyle;
		}

		_createClass(Player, [{
			key: 'setGame',
			value: function setGame(game) {
				this.game = game;
			}
		}, {
			key: 'onTurnStarted',
			value: function onTurnStarted() {}
		}, {
			key: 'makeMove',
			value: function makeMove(col) {}
		}]);

		return Player;
	}();

	return Player;
}]);
"use strict";

angular.module("templates", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("game.html", "<div>\r\n    <div class=\"info-bar row\">\r\n        <div class=\"col-xs-3 col-sm-3 col-md-3 col-lg-3\">\r\n            <div class=\"disc {{getCurrentPlayer().discStyle}}\"></div>\r\n        </div>\r\n        <div class=\"col-xs-6 col-sm-6 col-md-6 col-lg-6\">\r\n            <span class=\"message-bar {{getCurrentPlayer().discStyle}}\">\r\n                <span>{{message.text}}</span>\r\n            </span>\r\n        </div>\r\n        <div class=\"col-xs-3 col-sm-3 col-md-3 col-lg-3\">\r\n            <input class=\"reset-button btn btn-lg\" type=\"button\" ng-click=\"resetGame()\" value=\"New Game\"/>\r\n        </div>\r\n    </div>\r\n    <div class=\"row game-container\">\r\n        <div col=\"col-xs-12\">\r\n            <table id=\"game-grid\">\r\n                <thead>\r\n                    <tr>\r\n                        <th ng-repeat=\"colNo in colIndices\">\r\n                            <input class=\"drop-button\" \r\n                                ng-disabled=\"!getCurrentPlayer() || !getCurrentPlayer().isUser\" \r\n                                type=\"button\" \r\n                                ng-click=\"getCurrentPlayer().makeMove(colNo)\" \r\n                                value=\"drop!\" />\r\n                        </th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr ng-repeat=\"rowNo in rowIndices\">\r\n                        <td ng-repeat=\"colNo in colIndices\">\r\n                            <div class=\"disc {{playerCache[getGrid()[colNo][rowNo]].discStyle}} animated bounceInDown\" \r\n                                ng-if=\"getGrid()[colNo][rowNo] > 0\">\r\n                            </div>\r\n                            <div class=\"disc {{playerCache[getGrid()[colNo][rowNo] * -1].discStyle}} animated blink\" \r\n                                ng-if=\"getGrid()[colNo][rowNo] < 0\">\r\n                            </div>\r\n                        </td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n        </div>\r\n    </div>\r\n</div>\r\n");
  $templateCache.put("layout.html", "<div>\r\n    <nav class=\"navbar navbar-static-top\">\r\n        <div class=\"container\">\r\n            <div class=\"navbar-header\">\r\n                <a class=\"navbar-brand\" href=\"#\">Four in a row</a>\r\n            </div>\r\n        </div>\r\n    </nav>\r\n    <div class=\"page-content container-fluid\">\r\n        <div ui-view></div>\r\n    </div>\r\n</div>\r\n");
}]);