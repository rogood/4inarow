(function () {

	'use strict';

	angular.module('app')
		.factory('Grid', Grid);

	function Grid() {

		'ngInject';

		class Grid {

			constructor({
				rowCount = 6,
				colCount = 7
			} = {}) {
				this.rowCount = rowCount;
				this.colCount = colCount;

				this.grid = [];
				for (let i = 0; i < this.colCount; i++) {
					this.grid.push([]);
				}
			}

			reset() {
				for (let i = 0; i < this.colCount; i++) {
					this.grid[i].length = 0;
				}
			}

			drop(col, playerId) {
				this.grid[col].push(playerId);
			}
		}

		return Grid;

	};

})();