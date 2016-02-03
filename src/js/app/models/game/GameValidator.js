angular.module('app')
	.factory('GameValidator', [function () {
		var _grid, _colCount, _rowCount, _winningCount;

		class GameValidator {

			constructor(grid, colCount, rowCount, winningCount) {
				_grid = grid;
				_colCount = colCount;
				_rowCount = rowCount;
				_winningCount = winningCount;
			}
		
			// Check if move is a winning one
			checkWinner(playerId) {
				var chain, chains = [];

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
			checkTie() {
				var allFull = true;

				for (var i = 0; i < _rowCount; i++) {
					allFull = allFull && _grid[i].length >= _rowCount;
				}

				return allFull;
			}
		
			// Move Validation
			isValidMove(currentPlayer, playerId, col) {
				var isCurrentPlayer = playerId !== null && playerId == currentPlayer;
				var isValidCol = col > -1 && col < _colCount;
				var isColNotFull = _grid[col].length < _rowCount;

				return isCurrentPlayer && isValidCol && isColNotFull;
			}
		}

		function checkHorizontal(playerId) {
			var chain = [];

			for (var r = 0; r < _rowCount; r++) {
				chain.length = 0;
				for (var c = 0; c < _colCount; c++) {
					if(setChain(chain, c, r, playerId)){
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
					if(setChain(chain, c, r, playerId)){
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
			
			var currCol, currRow, chain = [];

			for (var r = 0; r < _rowCount; r++) {
				currCol = 0;
				currRow = r;
				chain.length = 0;

				while (currCol < _colCount && currRow < _rowCount) {
					if(setChain(chain, currCol, currRow, playerId)){
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
						if(setChain(chain, currCol, currRow, playerId)){
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
			
			var currCol, currRow, chain = [];

			for (var c = 0; c < _colCount; c++) {
				currCol = c;
				currRow = 0;
				chain.length = 0;

				while (currCol >= 0 && currRow < _rowCount) {
					if(setChain(chain, currCol, currRow, playerId)){
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
						if(setChain(chain, currCol, currRow, playerId)){
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
			}
			else if (chain.length < _winningCount) {
				chain.length = 0;
			}
			else {
				// We have a complete chain
				return true;
			}
			return false;
		}

		return GameValidator;

	}]);