angular.module('app')
.factory('AutomatedPlayer', ['$timeout', 'Player', function($timeout, Player)
{
	class AutomatedPlayer extends Player {
		
		constructor(id, discStyle, {
			isUser = false,
			delayMax = 800,
			delayMin = 200
		} = {}) {
			super(id, discStyle, { isUser : isUser, isAutomated: true });
			this.delayMax = delayMax;
			this.delayMin = delayMin;
		}
		
		onTurnStarted(){
			var self = this;
			var thinkingTime = this.delayMin + Math.floor(Math.random() * this.delayMax);
	
			$timeout(function()
			{
				makeAutomatedMove(self.game, self.id);
			},
			thinkingTime);
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