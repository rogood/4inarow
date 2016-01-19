angular.module('app')
.factory('gameValidator', [function()
{
	var colCount,
		rowCount, 
		winningCount;
	
	function init(_colCount, _rowCount, _winningCount){	
		colCount = _colCount;
		rowCount = _rowCount;
		winningCount = _winningCount;
	}
	
	function checkHorizontal(grid, playerId)
	{
		for(var i = 0; i < rowCount; i++)
		{
			var playerCount = 0;
			for(var j = 0; j < colCount; j++)
			{
				if(grid[j] && grid[j][i] === playerId)
				{
					playerCount++;
					if(playerCount === winningCount){
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
	
	function checkVertical(grid, playerId)
	{
		for(var i = 0; i < colCount; i++)
		{
			var playerCount = 0;
			for(var j = 0; j < grid[i].length; j++)
			{
				if(grid[i][j] === playerId)
				{
					playerCount++;
					if(playerCount === winningCount)
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
	
	function checkDiagonalSWtoNE(grid, playerId)
	{
		var currCol, currRow, playerCount;

		for(var r = 0; r < rowCount; r++)
		{
			currCol = 0;
			currRow = r;
			playerCount = 0;

			while(currCol < colCount && currRow < rowCount)
			{
				if(grid[currCol] && grid[currCol][currRow] === playerId)
				{
					playerCount++;
					if(playerCount === winningCount){
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

		for(var c = 0; c < colCount; c++)
		{
			currCol = c;
			currRow = 0;
			playerCount = 0;

			while(currCol < colCount && currRow < rowCount)
			{
				if(grid[currCol] && grid[currCol][currRow] === playerId)
				{
					playerCount++;
					if(playerCount === winningCount){
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

	function checkDiagonalSEtoNW(grid, playerId)
	{
		var currCol, currRow, playerCount;

		for(var c = 0; c < colCount; c++)
		{
			currCol = c;
			currRow = 0;
			playerCount = 0;

			while(currCol >= 0 && currRow < rowCount)
			{
				if(grid[currCol] && grid[currCol][currRow] === playerId)
				{
					playerCount++;
					if(playerCount === winningCount){
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

		for(var r = 0; r < rowCount; r++)
		{
			currCol = colCount - 1;
			currRow = r;
			playerCount = 0;

			while(currCol >= 0 && currRow < rowCount)
			{
				if(grid[currCol] && grid[currCol][currRow] === playerId)
				{
					playerCount++;
					if(playerCount === winningCount){
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
	
	// Check if move is a winning one
	function checkWinner(grid, playerId)
	{
		return checkHorizontal(grid, playerId) || 
			checkVertical(grid, playerId) || 
			checkDiagonalSWtoNE(grid, playerId) || 
			checkDiagonalSEtoNW(grid, playerId);
	}
	
	// Check full grid where there is no winner
	function checkTie(grid)
	{
		var allFull = true;

		for (var i = 0; i < rowCount; i++) {
			allFull = allFull && grid[i].length >= rowCount;
		}

		return allFull;
	}
	
	// Move Validation
	function isValidMove(grid, currentPlayer, playerId, col)
	{
		var isCurrentPlayer = playerId !== null && playerId == currentPlayer;
		var isValidCol = col > -1 && col < colCount;
		var isColNotFull = grid[col].length < rowCount;

		return isCurrentPlayer && isValidCol && isColNotFull;
	}
	
	return {
		init: init,
		checkWinner: checkWinner,
		checkTie: checkTie,
		isValidMove: isValidMove
	}
	
}]);