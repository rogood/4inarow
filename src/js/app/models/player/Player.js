angular.module('app')
.factory('Player', [function()
{
	class Player{
		
		constructor(id, { isUser = false, isAutomated = true} = {}) {
			this.id = id;
			this.isUser = isUser;
			this.isAutomated = isAutomated;
			this.game = null;
		}
		
		setGame(game){
			this.game = game;
		}
		
		onTurnStarted(){}
		makeMove(col){}
	}
	
	return Player;
	
}]);