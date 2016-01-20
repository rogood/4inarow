angular.module('app')
.controller('GameController', ['$scope', '$timeout', 'gameValidator', function($scope, $timeout, gameValidator)
{
	var colCount = 7,
		rowCount = 6,
		winningCount = 4;
		
	init();
	
	function init() {
		
		// Assign scope functions
		$scope.makeMove = makeMove;
		$scope.resetGame = resetGame;

		// Initialise scope variables
		$scope.colIndices = [];
		$scope.rowIndices = [];
		$scope.humanPlayer = 1;
		
		for (var i = colCount - 1; i >= 0; i--) {
			$scope.colIndices.unshift(i);
		}
	
		for (var j = rowCount - 1; j >= 0; j--) {
			$scope.rowIndices.push(j);
		}
		
		// Initialise the game
		gameValidator.init(colCount, rowCount, winningCount);
		resetGame();
		resizeGame();
	}

	function resetGame()
	{
		// reset grid
	    $scope.grid = [];
	    for (var i = 0; i < colCount; i++) {
	        $scope.grid.push([]);
	    }
		
		// reset other attributes
	    $scope.colChoice = null;
	    $scope.message = {
			cssClass: null,
			text: null
		};
		setCurrentPlayer(1);
	}
	
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
				cellSize = containerWidth / colCount;		
			}
			else{
				cellSize = containerHeight / rowCount;
			}
	
			for (i = 0; i < cellElems.length; i++){
				cellElems[i].style.width = 
					cellElems[i].style.height = 
						cellSize + "px";
			}
		});
	}

	function makeMove(playerId, col)
	{
		if(gameValidator.isValidMove($scope.grid, $scope.currentPlayer, playerId, col))
		{
			$scope.grid[col].push(playerId);

			if(gameValidator.checkTie($scope.grid))
			{
				$scope.message = {
					text: "No more moves can be made. It's a tie",
					cssClass: ""
				};
				setCurrentPlayer(null);
			}
			else if(gameValidator.checkWinner($scope.grid, playerId))
			{
				if(playerId === $scope.humanPlayer){
					$scope.message = {
						text: "You win!",
						cssClass: "message-win"
					}
				}
				else {
					$scope.message = {
						text: "You lose",
						cssClass: "message-lose"
					}
				}
						
				setCurrentPlayer(null);
			}
			else
			{
				// Timeout to allow for the 1s drop animation
				$timeout(function()
				{
					toggleCurrentPlayer();
				},
				1000);
			}
			
			// The move was made
			return true;
		}
		else
		{
			$scope.message = {
				text: "Cannot make move",
				cssClass: ""
			};
			$scope.colChoice = null;
			
			// The move was not made
			return false;
		}
	}

	function makeAutomatedMove(playerId)
	{
		var col = calculateMove();
		
		if(!makeMove(playerId, col))
		{
			makeAutomatedMove(playerId);
		}
	}
	
	// This function is for now just a random number generator.
	// This is the place to insert more intelligent logic later on.
	function calculateMove()
	{
		var min = 0;
		var max = colCount - 1;
		
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function toggleCurrentPlayer()
	{
		if($scope.currentPlayer === 1)
		{
			setCurrentPlayer(2);
		}
		else if($scope.currentPlayer === 2)
		{
			setCurrentPlayer(1);
		}
	}
	
	function setCurrentPlayer(playerId){
		
		$scope.colChoice = null;
				
		if(playerId > 0) {
			$scope.currentPlayer = playerId;	
			$scope.message = {
				cssClass: "player-" + playerId + "-turn"
			}
			
			if($scope.humanPlayer === playerId)
			{
				$scope.message.text = "It's your turn!";			
			}
			else
			{
				$scope.message.text = "I'm making a move...";
				$timeout(function()
				{
					makeAutomatedMove(playerId);
				},
				500);
			}
		}
		else {
			$scope.currentPlayer = null;
		}			
	}
		
}]);
