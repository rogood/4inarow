angular.module('app')
.factory('HumanPlayer', ['Player', function(Player)
{
	class HumanPlayer extends Player{
		
		constructor(id, discStyle, { isUser = false } = {}) {
			super(id, discStyle, { isUser : isUser, isAutomated: false });
		}
		
		makeMove(col){
			this.game.makeMove(this.id, col);
		}
	}
	
	return HumanPlayer;
	
}]);