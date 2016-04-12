'use strict';

(function () {

	'use strict';

	angular.module('app', ['ui.router', 'templates']);
})();
'use strict';

(function () {

	'use strict';

	angular.module('app').config(config);

	function config($stateProvider, $urlRouterProvider) {

		'ngInject';

		$urlRouterProvider.otherwise("/");

		$stateProvider.state('app', {
			url: "/",
			abstract: true,
			templateUrl: "layout.html"
		}).state('app.game', {
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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

	'use strict';

	angular.module('app').factory('Game', Game);

	function Game($timeout, Grid, GameValidator) {

		'ngInject';

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

			var chains = _gameValidator.checkWinner(playerId);
			if (chains) {
				markChains(chains);
				_onGameEnd(_playerCache[playerId], chains);
				setCurrentPlayer(null);
			} else {
				// Timeout to allow for the 1s drop animation
				_dropTimeout = $timeout(function () {
					if (_gameValidator.isFull()) {
						_onGameEnd(null);
						setCurrentPlayer(null);
					} else {
						toggleCurrentPlayer();
					}
				}, moveDelay);
			}
		}

		// Negate the id when there is a winning chain
		function markChains(chains) {

			var chain = undefined,
			    cell = undefined;

			for (var c = 0; c < chains.length; c++) {
				chain = chains[c].chain;
				for (var i = 0; i < chain.length; i++) {
					cell = _gridObj.grid[chain[i][0]][chain[i][1]];
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
	}
})();
'use strict';

(function () {

	'use strict';

	angular.module('app').controller('GameController', GameController);

	function GameController($timeout, Game, HumanPlayer, AutomatedPlayer, messageService) {

		'ngInject';

		var _game = new Game({ moveDelay: 1000, rowCount: 6, colCount: 7, winningCount: 4 }),
		    _messages = messageService.getMessages();

		var vm = this;
		vm.colIndices = [];
		vm.rowIndices = [];
		vm.message = {};
		vm.playerCache = _game.getPlayerCache();

		vm.getCurrentPlayer = _game.getCurrentPlayer;
		vm.getGrid = _game.getGrid;

		activate();

		function activate() {

			_game.registerPlayer(new HumanPlayer(1, "smiley", { isUser: true }));
			_game.registerPlayer(new AutomatedPlayer(2, "rage"));
			//_game.registerPlayer(new AutomatedPlayer(3, "red"));

			setEventHandlers();
			setIndices();
			resizeGame();

			_game.start();
		}

		function setEventHandlers() {
			_game.onGameEnd(function (winningPlayer, chains) {

				if (!winningPlayer) {
					vm.message = _messages.tie;
					vm.infoBarIcon = "disc-style-open_hands";
				} else if (winningPlayer.isUser) {
					vm.message = _messages.youWin;
					vm.infoBarIcon = "disc-style-thumbsup";
				} else {
					vm.message = _messages.youLose;
					vm.infoBarIcon = "disc-style-thumbsdown";
				}
			});

			_game.onIllegalMove(function (player) {

				if (player.isUser) {
					vm.message = _messages.cannotMove;
				}
			});

			_game.onPlayerChange(function (player) {

				if (player) {
					_messages.playerMove.setMessage(player);
					vm.message = _messages.playerMove;

					vm.infoBarIcon = player.discStyle;
				}
			});
		}

		function setIndices() {
			for (var i = _game.colCount - 1; i >= 0; i--) {
				vm.colIndices.unshift(i);
			}

			for (var i = _game.rowCount - 1; i >= 0; i--) {
				vm.rowIndices.push(i);
			}
		}

		// This resizes the grid so that is appears as large as possible while still keeping square cells.
		function resizeGame() {
			$timeout(function () {
				var gridBodyElem = document.getElementById("game-grid"),
				    cellElems = gridBodyElem.querySelectorAll('th, td'),
				    containerWidth = document.body.clientWidth - 10,
				    containerHeight = document.body.clientHeight - gridBodyElem.getBoundingClientRect().top - 25,
				    cellSize = undefined;

				if (containerWidth < containerHeight) {
					cellSize = containerWidth / _game.colCount;
				} else {
					cellSize = containerHeight / (_game.rowCount + 1);
				}

				for (var i = 0; i < cellElems.length; i++) {
					cellElems[i].style.width = cellElems[i].style.height = cellSize + "px";
				}
			});
		}
	}
})();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

	'use strict';

	angular.module('app').factory('GameValidator', GameValidator);

	function GameValidator() {

		'ngInject';

		var _grid = undefined,
		    _colCount = undefined,
		    _rowCount = undefined,
		    _winningCount = undefined;

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
					var chain = undefined,
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
				key: 'isFull',
				value: function isFull() {
					var allFull = true;

					for (var i = 0; i < _colCount; i++) {
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
					if (setChain(chain, c, r, playerId)) {
						break;
					}
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
					if (setChain(chain, c, r, playerId)) {
						break;
					}
				}

				if (chain.length >= _winningCount) {
					return chain;
				}
			}

			return null;
		}

		function checkDiagonalNE(playerId) {

			var currCol = undefined,
			    currRow = undefined,
			    chain = [];

			for (var r = 0; r < _rowCount; r++) {
				currCol = 0;
				currRow = r;
				chain.length = 0;

				while (currCol < _colCount && currRow < _rowCount) {
					if (setChain(chain, currCol, currRow, playerId)) {
						break;
					}

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
						if (setChain(chain, currCol, currRow, playerId)) {
							break;
						}

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

			var currCol = undefined,
			    currRow = undefined,
			    chain = [];

			for (var c = 0; c < _colCount; c++) {
				currCol = c;
				currRow = 0;
				chain.length = 0;

				while (currCol >= 0 && currRow < _rowCount) {
					if (setChain(chain, currCol, currRow, playerId)) {
						break;
					}

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
						if (setChain(chain, currCol, currRow, playerId)) {
							break;
						}

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
			} else {
				// We have a complete chain
				return true;
			}
			return false;
		}

		return GameValidator;
	}
})();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

	'use strict';

	angular.module('app').factory('Grid', Grid);

	function Grid() {

		'ngInject';

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
	}
})();
'use strict';

(function () {

	'use strict';

	angular.module('app').controller('NavController', NavController);

	function NavController($state) {

		'ngInject';

		var vm = this;
		vm.onNewGameClicked = onNewGameClicked;

		function onNewGameClicked() {
			$state.go("app.game", null, { reload: true });
		}
	}
})();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {

	'use strict';

	angular.module('app').factory('AutomatedPlayer', AutomatedPlayer);

	function AutomatedPlayer($timeout, Player) {

		'ngInject';

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
			var col = undefined;

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
	}
})();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {

	'use strict';

	angular.module('app').factory('HumanPlayer', HumanPlayer);

	function HumanPlayer(Player) {

		'ngInject';

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
	}
})();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

	'use strict';

	angular.module('app').factory('Player', Player);

	function Player() {

		'ngInject';

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
	}
})();
'use strict';

(function () {

	'use strict';

	angular.module('app').factory('messageService', messageService);

	function messageService() {

		'ngInject';

		var _messages = {
			"tie": {
				text: "It's a tie",
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
	}
})();