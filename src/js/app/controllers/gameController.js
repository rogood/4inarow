angular.module('app')
.controller('GameController', ['$scope', '$timeout', 'Game', 'HumanPlayer', 'AutomatedPlayer', 'messageService',
	function($scope, $timeout, Game, HumanPlayer, AutomatedPlayer, messageService)
{
	var i,
		_game = new Game({ moveDelay: 1000, rowCount: 6, colCount: 7, winningCount: 4 }),
		_messages = messageService.getMessages();	
	
	// Initialise scope variables
	$scope.colIndices = [];
	$scope.rowIndices = [];
	
	// These scope variables are set to functions in order to capture 
	// internal changes to the properties
	$scope.getCurrentPlayer = _game.getCurrentPlayer;
	$scope.getGrid = _game.getGrid;
	$scope.message = {};
	
	for (i = _game.colCount - 1; i >= 0; i--) {
		$scope.colIndices.unshift(i);
	}

	for (i = _game.rowCount - 1; i >= 0; i--) {
		$scope.rowIndices.push(i);
	}
	
	$scope.resetGame = function(){
		_game.reset();
	};
	
	// Setting up the game
	_game.registerPlayer(new HumanPlayer(1, "smiley", { isUser: true }));
	_game.registerPlayer(new AutomatedPlayer(2, "rage"));
	//_game.registerPlayer(new AutomatedPlayer(3, "red"));
	
	$scope.playerCache = _game.getPlayerCache();
		
	_game.onGameEnd(function(winningPlayer, chains){
		
		if (!winningPlayer){
			$scope.message = _messages["tie"];
			$scope.infoBarIcon = "disc-style-open_hands";
		}
		else if(winningPlayer.isUser){
			$scope.message = _messages["youWin"];
			$scope.infoBarIcon = "disc-style-thumbsup";
		}
		else {
			$scope.message = _messages["youLose"];
			$scope.infoBarIcon = "disc-style-thumbsdown";
		}
		
	});

	_game.onIllegalMove(function(player){
		
		if(player.isUser){
			$scope.message = _messages["cannotMove"];
		}
		
	});
		
	_game.onPlayerChange(function(player){
		
		if(player){
			_messages["playerMove"].setMessage(player);
			$scope.message = _messages["playerMove"];	
			
			$scope.infoBarIcon = player.discStyle;
		}
		
	});
			
	resizeGame();
	
	_game.start();
	
	// This resizes the grid so that is appears as large as possible while still keeping square cells.
	function resizeGame(){
		$timeout(function(){
			var gridBodyElem = document.getElementById("game-grid"),
				cellElems = gridBodyElem.querySelectorAll('th, td'),
				containerWidth = document.body.clientWidth - 10,
				containerHeight = document.body.clientHeight - gridBodyElem.getBoundingClientRect().top - 25,
				cellSize,
				i;
			
			if(containerWidth < containerHeight){
				cellSize = containerWidth / _game.colCount;		
			}
			else{
				cellSize = containerHeight / (_game.rowCount + 1);
			}
			
			for (i = 0; i < cellElems.length; i++){
				cellElems[i].style.width = 
					cellElems[i].style.height = 
						cellSize + "px";
			}
		});
	}
		
}]);
