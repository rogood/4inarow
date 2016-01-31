angular.module('app')
.factory('Game', ['$timeout', 'Grid', 'GameValidator', 
	function($timeout, Grid, GameValidator)
{
	var _currentPlayerId = null,
		_gameValidator = null,
		_players = [],
		_playerCache = {},
		_gridObj = null,
		_dropTimeout = null,
		
		// Event Handlers
		_onIllegalMove = function(playerId){},
		_onGameEnd = function(winningPlayerId){},
		_onPlayerChange = function(player){};
	
	class Game{
		
		constructor({
			winningCount = 4,
			moveDelay = 500,
			rowCount = 6,
			colCount = 7
		} = {}) 
		{
			this.winningCount = winningCount;
			this.moveDelay = moveDelay;
			this.rowCount = rowCount;
			this.colCount = colCount;
			
			_gridObj = new Grid({rowcount: rowCount, colCount: colCount});
			this.grid = _gridObj.grid;

			_gameValidator = new GameValidator(this.grid, this.colCount, this.rowCount, this.winningCount);
		}
		
		onIllegalMove(callback){ 
			_onIllegalMove = callback;
		}
		
		onGameEnd(callback){ 
			_onGameEnd = callback;
		}
		
		onPlayerChange(callback){ 
			_onPlayerChange = callback;
		}
		
		getGrid(){
			return _gridObj.grid;
		}
		
		getCurrentPlayer(){
			return _playerCache[_currentPlayerId];
		}
	
		start(){ 
			setCurrentPlayer(_players[0]);
		}
		
		reset(){ 
			$timeout.cancel(_dropTimeout);   
			_gridObj.reset();
			setCurrentPlayer(_players[0]);
		}
		
		registerPlayer(player){
			player.setGame(this);
			_playerCache[player.id] = player;
			_players.push(player.id);
		}
		
		makeMove(playerId, col){
		
			if(_gameValidator.isValidMove(_currentPlayerId, playerId, col))
			{
				_gridObj.drop(col, playerId);
	
				checkForGameEnd(playerId, this.moveDelay);
				
				// The move was made
				return true;
			}
			else
			{
				_onIllegalMove(_playerCache[playerId]);
				
				// The move was not made
				return false;
			}
		}
	}
	
	function checkForGameEnd(playerId, moveDelay){
		
		if(_gameValidator.checkTie())
		{
			_onGameEnd(null);
			setCurrentPlayer(null);
		}
		else if(_gameValidator.checkWinner(playerId))
		{
			_onGameEnd(_playerCache[playerId]);		
			setCurrentPlayer(null);
		}
		else
		{
			// Timeout to allow for the 1s drop animation
			_dropTimeout = $timeout(function()
			{
				toggleCurrentPlayer();
			}, moveDelay);
		}
		
	}
	
	function setCurrentPlayer(playerId){
		
		var player = _playerCache[playerId];
		
		if(playerId) {		
			player.onTurnStarted(Game.prototype.makeMove);
		}
			
		_currentPlayerId = playerId;
		
		_onPlayerChange(player);		
	}
	
	function toggleCurrentPlayer()
	{
		setCurrentPlayer(getNextPlayer(_currentPlayerId));
	}
	
	function getNextPlayer(playerId){
		
		var index = _players.indexOf(playerId);
		
		return index >= 0 && index < _players.length - 1 ?
			_players[index + 1] :
			_players[0];
	}
	
	return Game;
	
}]);