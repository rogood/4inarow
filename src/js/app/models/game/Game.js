angular.module('app')
.factory('Game', ['$timeout', 'Grid', 'GameValidator', 
	function($timeout, Grid, GameValidator)
{
	let _currentPlayerId = null,
		_gameValidator = null,
		_players = [],
		_playerCache = {},
		_gridObj = null,
		_dropTimeout = null,
		_lastMoveMadeBy = null,
		
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
		
		getPlayerCache(){
			return _playerCache;
		}
	
		start(){ 
			setCurrentPlayer(_players[0]);
		}
		
		reset(){ 
			$timeout.cancel(_dropTimeout);   
			_gridObj.reset();
			_lastMoveMadeBy = null;
			setCurrentPlayer(_players[0]);
		}
		
		registerPlayer(player){
			player.setGame(this);
			_playerCache[player.id] = player;
			_players.push(player.id);
		}
		
		makeMove(playerId, col){
		
			if(_lastMoveMadeBy !== playerId && _gameValidator.isValidMove(_currentPlayerId, playerId, col))
			{
				_lastMoveMadeBy = playerId;
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
		
		let chains = _gameValidator.checkWinner(playerId);
		if(chains){
			markChains(chains);
			_onGameEnd(_playerCache[playerId], chains);		
			setCurrentPlayer(null);
		}
		else{
			// Timeout to allow for the 1s drop animation
			_dropTimeout = $timeout(function(){
				if(_gameValidator.isFull()){
					_onGameEnd(null);
					setCurrentPlayer(null);
				}
				else{
					toggleCurrentPlayer();
				}
			}, moveDelay);
		}
	}
	
	// Negate the id when there is a winning chain
	function markChains(chains){
		
		let chain, cell;
		
		for (let c = 0; c < chains.length; c++) {
			chain = chains[c].chain;
			for (let i = 0; i < chain.length; i++) {
				cell = _gridObj.grid[chain[i][0]][chain[i][1]];
				if(cell > 0){
					_gridObj.grid[chain[i][0]][chain[i][1]] = cell * -1;
				}
			}			
		}
	}
	
	function setCurrentPlayer(playerId){
		
		let player = _playerCache[playerId];
		
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
		
		let index = _players.indexOf(playerId);
		
		return index >= 0 && index < _players.length - 1 ?
			_players[index + 1] :
			_players[0];
	}
	
	return Game;
	
}]);