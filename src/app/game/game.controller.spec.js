describe('GameController', function () {
  beforeEach(module('app'));

  var $controller;

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  describe('makeMove', function () {

    it('player 1 should be able to make the initial move', function () {

      var $scope = {},
        controller = $controller('GameController', { $scope: $scope });

      expect(controller.getCurrentPlayer().id).toBe(1);

    });

    it('player 1 should make an initial move', function () {

      var $scope = {},
        controller = $controller('GameController', { $scope: $scope }),
        col = 3;

      controller.getCurrentPlayer().makeMove(3);
      expect(controller.getGrid()[col][0]).toBe(1);

    });

  });

});