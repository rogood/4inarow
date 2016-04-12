describe('GameValidator', function () {
  beforeEach(module('app'));

  var GameValidator;

  beforeEach(inject(function () {
    var $injector = angular.injector(['app']);
    GameValidator = $injector.get('GameValidator');
  }));

  describe('gameValidator.checkWinner', function () {
    
    it('player 1 should have a winning horizontal chain', function () {
      
      var colCount = 7,
        rowCount = 6,
        winningCount = 4,
        grid = [[2, 1], [1, 2, 1], [1], [1, 2, 2, 2], [1], [2], [1]],
        gameValidator = new GameValidator(grid, colCount, rowCount, winningCount),
        winningChains = gameValidator.checkWinner(1);

      expect(winningChains.length).toBe(1);
      expect(winningChains[0].type).toBe('horizontal');
      expect(winningChains[0].chain.length).toBe(4);
      
      grid = [[], [1], [1, 2], [1, 2], [1], [2], [1, 2]];
      gameValidator = new GameValidator(grid, colCount, rowCount, winningCount);
      winningChains = gameValidator.checkWinner(1);
      expect(winningChains.length).toBe(1);
      expect(winningChains[0].type).toBe('horizontal');
      expect(winningChains[0].chain.length).toBe(4);
      
      grid = [[1], [1], [1, 2], [1, 2], [1], [2], [1, 2]];
      gameValidator = new GameValidator(grid, colCount, rowCount, winningCount);
      winningChains = gameValidator.checkWinner(1);
      expect(winningChains.length).toBe(1);
      expect(winningChains[0].type).toBe('horizontal');
      expect(winningChains[0].chain.length).toBe(5);
      
    });
    
    it('player 1 should have a winning vertical chain', function () {
      
      var colCount = 7,
        rowCount = 6,
        winningCount = 4,
        grid = [[2, 1, 2], [1, 1, 1, 1], [1, 1], [2, 2, 2], [2], [2], [1]],
        gameValidator = new GameValidator(grid, colCount, rowCount, winningCount),
        winningChains = gameValidator.checkWinner(1);

      expect(winningChains.length).toBe(1);
      expect(winningChains[0].type).toBe('vertical');
      expect(winningChains[0].chain.length).toBe(4);
      
    });
    
    it('player 1 should have a winning north-east diagonal chain', function () {
      
      var colCount = 7,
        rowCount = 6,
        winningCount = 4,
        grid = [[], [2], [1], [2, 1], [2, 1, 1], [2, 2, 1, 1], []],
        gameValidator = new GameValidator(grid, colCount, rowCount, winningCount),
        winningChains = gameValidator.checkWinner(1);

      expect(winningChains.length).toBe(1);
      expect(winningChains[0].type).toBe('diagonalNE');
      expect(winningChains[0].chain.length).toBe(4);
      
    });
    
    it('player 1 should have a winning north-west diagonal chain', function () {
      
      var colCount = 7,
        rowCount = 6,
        winningCount = 4,
        grid = [[1, 2, 1, 1], [2, 2, 1], [1, 1], [1, 2], [2], [2], []],
        gameValidator = new GameValidator(grid, colCount, rowCount, winningCount),
        winningChains = gameValidator.checkWinner(1);

      expect(winningChains.length).toBe(1);
      expect(winningChains[0].type).toBe('diagonalNW');
      expect(winningChains[0].chain.length).toBe(4);
      
    });
    
    it('player 1 should have a winning north-west diagonal and horizontal chain', function () {
      
      var colCount = 7,
        rowCount = 6,
        winningCount = 4,
        grid = [
          [2, 2, 1, 1], 
          [2, 2, 1], 
          [2, 1, 1], 
          [1, 1, 1, 2, 2, 1], 
          [1, 2, 2, 1], 
          [2, 1, 1, 2, 2, 1], 
          [2, 2, 1]
        ],
        gameValidator = new GameValidator(grid, colCount, rowCount, winningCount),
        winningChains = gameValidator.checkWinner(1);

      expect(winningChains.length).toBe(2);
      expect(winningChains[0].type).toBe('horizontal');
      expect(winningChains[0].chain.length).toBe(4);
      expect(winningChains[1].type).toBe('diagonalNW');
      expect(winningChains[1].chain.length).toBe(4);
      
    });
    
    it('there should be a tie', function () {
      
      var colCount = 7,
        rowCount = 6,
        winningCount = 4,
        grid = [
          [2, 2, 1, 2, 1, 2], 
          [1, 1, 2, 2, 1, 2], 
          [2, 1, 2, 1, 2, 1], 
          [1, 2, 2, 1, 1, 2], 
          [1, 2, 1, 2, 1, 1], 
          [1, 2, 2, 1, 2, 1], 
          [2, 1, 1, 2, 2, 1]
        ],
        gameValidator = new GameValidator(grid, colCount, rowCount, winningCount),
        isFull = gameValidator.isFull(),
        winningChains = gameValidator.checkWinner(1);

      expect(isFull).toBeTruthy();
      expect(winningChains).toBeFalsy();
      
    });
    
    it('the grid should not be full', function () {
      
      var colCount = 7,
        rowCount = 6,
        winningCount = 4,
        grid = [[1, 2, 1, 1], [2, 2, 1], [1, 2], [1, 2], [2], [2], []],
        gameValidator = new GameValidator(grid, colCount, rowCount, winningCount),
        isFull = gameValidator.isFull();

      expect(isFull).toBeFalsy();
      
    });
    
    it('player 1 should not have a winning chain', function () {
      
      var colCount = 7,
        rowCount = 6,
        winningCount = 4,
        grid = [[1, 2, 1, 1], [2, 2, 1], [1, 2], [1, 2], [2], [2], []],
        gameValidator = new GameValidator(grid, colCount, rowCount, winningCount),
        winningChains = gameValidator.checkWinner(1);

      expect(winningChains).toBeFalsy();
      
    });
    
  });
});