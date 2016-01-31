angular.module('app')
.factory('AutomatedPlayer', ['$timeout', 'Player', function($timeout, Player)
{
	class AutomatedPlayer extends Player {
		
		constructor(id, { isUser = false } = {}) {
			super(id, { isUser : isUser, isAutomated: true });
		}
		
		onTurnStarted(){
			var self = this;
	
			$timeout(function()
			{
				makeAutomatedMove(self.game, self.id);
			},
			500);
		}
	}
	
	// Private Functions
	function makeAutomatedMove(game, id)
	{
		var col;
		
		do{
			col = calculateMove(game.colCount);
		}
		while(!game.makeMove(id, col));
	}
	
	// This function is for now just a random number generator.
	// This is the place to insert more intelligent logic later on.
	function calculateMove(colCount)
	{
		var min = 0;
		var max = colCount - 1;
		
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	return AutomatedPlayer;
	
}]);