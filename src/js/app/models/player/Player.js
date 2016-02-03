angular.module('app')
.factory('Player', [function()
{
	class Player{
		
		constructor(id, discStyle, { isUser = false, isAutomated = true} = {}) {
			this.id = id;
			this.isUser = isUser;
			this.isAutomated = isAutomated;
			this.game = null;
			this.discStyle = "disc-style-" + discStyle;
		}
		
		setGame(game){
			this.game = game;
		}
		
		onTurnStarted(){}
		makeMove(col){}
	}
	
	return Player;
	
}]);