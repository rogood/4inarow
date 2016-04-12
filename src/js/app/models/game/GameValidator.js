(function () {

	'use strict';

	angular.module('app')
		.factory('GameValidator', GameValidator);

	function GameValidator() {
		
		'ngInject';
		
		let _grid, _colCount, _rowCount, _winningCount;

		class GameValidator {

			constructor(grid, colCount, rowCount, winningCount) {
				_grid = grid;
				_colCount = colCount;
				_rowCount = rowCount;
				_winningCount = winningCount;
			}
		
			// Check if move is a winning one
			checkWinner(playerId) {
				let chain, chains = [];

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
			isFull() {
				let allFull = true;

				for (let i = 0; i < _colCount; i++) {
					allFull = allFull && _grid[i].length >= _rowCount;
				}

				return allFull;
			}
		
			// Move Validation
			isValidMove(currentPlayer, playerId, col) {
				let isCurrentPlayer = playerId !== null && playerId == currentPlayer;
				let isValidCol = col > -1 && col < _colCount;
				let isColNotFull = _grid[col].length < _rowCount;

				return isCurrentPlayer && isValidCol && isColNotFull;
			}
		}

		function checkHorizontal(playerId) {
			let chain = [];

			for (let r = 0; r < _rowCount; r++) {
				chain.length = 0;
				for (let c = 0; c < _colCount; c++) {
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
			let chain = [];
			for (let c = 0; c < _colCount; c++) {
				chain.length = 0;
				for (let r = 0; r < _grid[c].length; r++) {
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

			let currCol, currRow, chain = [];

			for (let r = 0; r < _rowCount; r++) {
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
				for (let c = 0; c < _colCount; c++) {
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

			let currCol, currRow, chain = [];

			for (let c = 0; c < _colCount; c++) {
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
				for (let r = 0; r < _rowCount; r++) {
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

	}

})();