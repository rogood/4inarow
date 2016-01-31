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
	$scope.currentPlayer = _game.getCurrentPlayer;
	$scope.grid = _game.getGrid;
	
	for (i = _game.colCount - 1; i >= 0; i--) {
		$scope.colIndices.unshift(i);
	}

	for (i = _game.rowCount - 1; i >= 0; i--) {
		$scope.rowIndices.push(i);
	}
	
	$scope.message = {};
	
	$scope.resetGame = function(){
		_game.reset();
	};
	
	$scope.makeMove = function(col){
		_game.makeMove($scope.currentPlayer, col);
	};
	
	// Setting up the game
	_game.registerPlayer(new HumanPlayer(1, { isUser: true }));
	_game.registerPlayer(new AutomatedPlayer(2));
		
	_game.onGameEnd(function(winningPlayer){
		
		if (!winningPlayer){
			$scope.message = _messages["tie"];
		}
		else if(winningPlayer.isUser){
			$scope.message = _messages["youWin"];
		}
		else {
			$scope.message = _messages["youLose"];
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
		}
		
	});
			
	resizeGame();
	
	_game.start();
	
	// This resizes the grid so that is appears as large as possible while still keeping square cells.
	function resizeGame(){
		$timeout(function(){
			var gridBodyElem = document.getElementById("game-grid").getElementsByTagName('tbody')[0],
				cellElems = gridBodyElem.getElementsByTagName('td'),
				containerWidth = document.body.clientWidth - 20,
				containerHeight = document.body.clientHeight - gridBodyElem.getBoundingClientRect().top - 20,
				cellSize,
				i;
			
			if(containerWidth < containerHeight){
				cellSize = containerWidth / _game.colCount;		
			}
			else{
				cellSize = containerHeight / _game.rowCount;
			}
	
			for (i = 0; i < cellElems.length; i++){
				cellElems[i].style.width = 
					cellElems[i].style.height = 
						cellSize + "px";
			}
		});
	}
		
}]);
