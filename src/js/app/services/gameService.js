angular.module('app')
.factory('gameService', ['Game', function(Game)
{
	var _game;
	
	function getGame(){
		
		if(!_game){
			_game = new Game();
		}
		
		return _game;
	}
	
	return {
		getGame: getGame
	};
	
}]);