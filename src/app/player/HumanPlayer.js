(function () {

	'use strict';

	angular.module('app')
		.factory('HumanPlayer', HumanPlayer);

	function HumanPlayer(Player) {
		
		'ngInject';
		
		class HumanPlayer extends Player {

			constructor(id, discStyle, { isUser = false } = {}) {
				super(id, discStyle, { isUser: isUser, isAutomated: false });
			}

			makeMove(col) {
				this.game.makeMove(this.id, col);
			}
		}

		return HumanPlayer;
	}

})();