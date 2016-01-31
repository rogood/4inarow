angular.module('app')
.factory('playerService', ['HumanPlayer', 'AutomatedPlayer', function(HumanPlayer, AutomatedPlayer)
{
	var _players = [];
	
	function createPlayers(game){
		
		var player1 = new HumanPlayer(1, true);
		game.registerPlayer(player1);
		_players.push(player1);
	
		var player2 = new AutomatedPlayer(2);
		game.registerPlayer(player2);
		_players.push(player2);
			
		return _players;
	}
	
	function getPlayer(id){
		for (var i = 0, len = _players.length; i < len; i++) {
			if(id === _players[i].id){
				return _players[i];
			}
		}
		
		return null;
	}
	
	return {
		createPlayers: createPlayers,
		getPlayer: getPlayer
	};
	
}]);