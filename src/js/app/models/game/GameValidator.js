angular.module('app')
.factory('GameValidator', [function()
{
	var _grid, _colCount, _rowCount, _winningCount;

	class GameValidator{
		
		constructor(grid, colCount, rowCount, winningCount){
			_grid = grid;
			_colCount = colCount;
			_rowCount = rowCount;
			_winningCount = winningCount;
		}
		
		// Check if move is a winning one
		checkWinner(playerId)
		{
			return checkHorizontal(playerId) || 
				checkVertical(playerId) || 
				checkDiagonalSWtoNE(playerId) || 
				checkDiagonalSEtoNW(playerId);
		}
		
		// Check full grid where there is no winner
		checkTie()
		{
			var allFull = true;
	
			for (var i = 0; i < _rowCount; i++) {
				allFull = allFull && _grid[i].length >= _rowCount;
			}
	
			return allFull;
		}
		
		// Move Validation
		isValidMove(currentPlayer, playerId, col)
		{
			var isCurrentPlayer = playerId !== null && playerId == currentPlayer;
			var isValidCol = col > -1 && col < _colCount;
			var isColNotFull = _grid[col].length < _rowCount;
	
			return isCurrentPlayer && isValidCol && isColNotFull;
		}
		
	}
	
	function checkHorizontal(playerId)
	{
		for(var i = 0; i < _rowCount; i++)
		{
			var playerCount = 0;
			for(var j = 0; j < _colCount; j++)
			{
				if(_grid[j] && _grid[j][i] === playerId)
				{
					playerCount++;
					if(playerCount === _winningCount){
						return true;
					}
				}
				else
				{
					playerCount = 0;
				}
			}
		}
		
		return false;
	}
	
	function checkVertical(playerId)
	{
		for(var i = 0; i < _colCount; i++)
		{
			var playerCount = 0;
			for(var j = 0; j < _grid[i].length; j++)
			{
				if(_grid[i][j] === playerId)
				{
					playerCount++;
					if(playerCount === _winningCount)
					{
						return true;
					}
				}
				else
				{
					playerCount = 0;
				}
			}
		}

		return false;
	}
	
	function checkDiagonalSWtoNE(playerId)
	{
		var currCol, currRow, playerCount;

		for(var r = 0; r < _rowCount; r++)
		{
			currCol = 0;
			currRow = r;
			playerCount = 0;

			while(currCol < _colCount && currRow < _rowCount)
			{
				if(_grid[currCol] && _grid[currCol][currRow] === playerId)
				{
					playerCount++;
					if(playerCount === _winningCount){
						return true;
					}
				}
				else
				{
					playerCount = 0;
				}

				currRow++;
				currCol++;
			}
		}

		for(var c = 0; c < _colCount; c++)
		{
			currCol = c;
			currRow = 0;
			playerCount = 0;

			while(currCol < _colCount && currRow < _rowCount)
			{
				if(_grid[currCol] && _grid[currCol][currRow] === playerId)
				{
					playerCount++;
					if(playerCount === _winningCount){
						return true;
					}
				}
				else
				{
					playerCount = 0;
				}

				currRow++;
				currCol++;
			}
		}

		return false;
	}

	function checkDiagonalSEtoNW(playerId)
	{
		var currCol, currRow, playerCount;

		for(var c = 0; c < _colCount; c++)
		{
			currCol = c;
			currRow = 0;
			playerCount = 0;

			while(currCol >= 0 && currRow < _rowCount)
			{
				if(_grid[currCol] && _grid[currCol][currRow] === playerId)
				{
					playerCount++;
					if(playerCount === _winningCount){
						return true;
					}
				}
				else
				{
					playerCount = 0;
				}

				currRow++;
				currCol--;
			}
		}

		for(var r = 0; r < _rowCount; r++)
		{
			currCol = _colCount - 1;
			currRow = r;
			playerCount = 0;

			while(currCol >= 0 && currRow < _rowCount)
			{
				if(_grid[currCol] && _grid[currCol][currRow] === playerId)
				{
					playerCount++;
					if(playerCount === _winningCount){
						return true;
					}
				}
				else
				{
					playerCount = 0;
				}

				currRow++;
				currCol--;
			}
		}

		return false;
	}
	
	return GameValidator;
	
}]);