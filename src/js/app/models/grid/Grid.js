angular.module('app')
.factory('Grid', [function()
{
	class Grid {
		
		constructor({
			rowCount = 6,
			colCount = 7
		} = {})
		{
			this.rowCount = rowCount;
			this.colCount = colCount;
			
			this.grid = [];
			for (var i = 0; i < this.colCount; i++) {
				this.grid.push([]);
			}
		}
		
		reset(){
			for (var i = 0; i < this.colCount; i++) {
				this.grid[i].length = 0;
			}
		}
		
		drop(col, playerId){
			this.grid[col].push(playerId);
		}
	}
	
	return Grid;
	
}]);