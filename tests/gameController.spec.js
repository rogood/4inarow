describe('GameController', function () {
  beforeEach(module('app'));

  var $controller;

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  describe('$scope.makeMove', function () {

    it('player 1 should make a move', function () {

      var $scope = {},
        controller = $controller('GameController', { $scope: $scope }),
        playerId = 1,
        col = 0;
        
        var isMoveMade = $scope.makeMove(playerId, col);
        expect(isMoveMade).toBeTruthy();

    });

    it('player 2 should make a move', function () {

      var $scope = {},
        controller = $controller('GameController', { $scope: $scope }),
        playerId = 2,
        col = 0;
        
        var isMoveMade = $scope.makeMove(playerId, col);
        expect(isMoveMade).toBeFalsy();

    });
  });
});