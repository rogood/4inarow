angular.module('app')
.factory('messageService', [function()
{
	var _messages = {
		"tie" : 
		{
			text: "It's a tie",
			cssClass: ""
		},
		"youWin" : {
			text: "You win!",
			cssClass: "message-win"
		},
		"youLose" :{
			text: "You lose",
			cssClass: "message-lose"
		},
		"cannotMove" : {
			text: "Cannot make move",
			cssClass: ""
		},
		"playerMove" : {
			text: null,
			cssClass: null,
			setMessage(player){
				this.cssClass = "player-" + player.id + "-turn";
				this.text = player.isUser ? "It's your turn!" : "I'm making a move...";	
			}
		}
	};
	
	return {
		getMessages: function(){
			return _messages;
		}
	};
	
}]);