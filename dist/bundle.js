"use strict";function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function _inherits(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function _inherits(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}angular.module("app",["ui.router","templates"]).config(["$stateProvider","$urlRouterProvider",function(e,n){n.otherwise("/"),e.state("app",{url:"/","abstract":!0,templateUrl:"layout.html"}).state("app.game",{url:"",templateUrl:"game.html",controller:"GameController"})}]),angular.module("app").controller("GameController",["$scope","$timeout","Game","HumanPlayer","AutomatedPlayer","messageService",function(e,n,t,r,o,a){function i(){n(function(){var e,n,t=document.getElementById("game-grid").getElementsByTagName("tbody")[0],r=t.getElementsByTagName("td"),o=document.body.clientWidth-20,a=document.body.clientHeight-t.getBoundingClientRect().top-20;for(e=a>o?o/l.colCount:a/l.rowCount,n=0;n<r.length;n++)r[n].style.width=r[n].style.height=e+"px"})}var u,l=new t({moveDelay:1e3,rowCount:6,colCount:7,winningCount:4}),s=a.getMessages();for(e.colIndices=[],e.rowIndices=[],e.currentPlayer=l.getCurrentPlayer,e.grid=l.getGrid,u=l.colCount-1;u>=0;u--)e.colIndices.unshift(u);for(u=l.rowCount-1;u>=0;u--)e.rowIndices.push(u);e.message={},e.resetGame=function(){l.reset()},e.makeMove=function(n){l.makeMove(e.currentPlayer,n)},l.registerPlayer(new r(1,{isUser:!0})),l.registerPlayer(new o(2)),l.onGameEnd(function(n){n?n.isUser?e.message=s.youWin:e.message=s.youLose:e.message=s.tie}),l.onIllegalMove(function(n){n.isUser&&(e.message=s.cannotMove)}),l.onPlayerChange(function(n){n&&(s.playerMove.setMessage(n),e.message=s.playerMove)}),i(),l.start()}]),angular.module("app").factory("gameService",["Game",function(e){function n(){return t||(t=new e),t}var t;return{getGame:n}}]),angular.module("app").factory("messageService",[function(){var e={tie:{text:"No more moves can be made. It's a tie",cssClass:""},youWin:{text:"You win!",cssClass:"message-win"},youLose:{text:"You lose",cssClass:"message-lose"},cannotMove:{text:"Cannot make move",cssClass:""},playerMove:{text:null,cssClass:null,setMessage:function(e){this.cssClass="player-"+e.id+"-turn",this.text=e.isUser?"It's your turn!":"I'm making a move..."}}};return{getMessages:function(){return e}}}]),angular.module("app").factory("playerService",["HumanPlayer","AutomatedPlayer",function(e,n){function t(t){var r=new e(1,!0);t.registerPlayer(r),o.push(r);var a=new n(2);return t.registerPlayer(a),o.push(a),o}function r(e){for(var n=0,t=o.length;t>n;n++)if(e===o[n].id)return o[n];return null}var o=[];return{createPlayers:t,getPlayer:r}}]);var _createClass=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}();angular.module("app").factory("Game",["$timeout","Grid","GameValidator",function(e,n,t){function r(n,t){l.checkTie()?(g(null),o(null)):l.checkWinner(n)?(g(c[n]),o(null)):v=e(function(){a()},t)}function o(e){var n=c[e];e&&n.onTurnStarted(p.prototype.makeMove),u=e,m(n)}function a(){o(i(u))}function i(e){var n=s.indexOf(e);return n>=0&&n<s.length-1?s[n+1]:s[0]}var u=null,l=null,s=[],c={},f=null,v=null,d=function(e){},g=function(e){},m=function(e){},p=function(){function a(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],r=e.winningCount,o=void 0===r?4:r,i=e.moveDelay,u=void 0===i?500:i,s=e.rowCount,c=void 0===s?6:s,v=e.colCount,d=void 0===v?7:v;_classCallCheck(this,a),this.winningCount=o,this.moveDelay=u,this.rowCount=c,this.colCount=d,f=new n({rowcount:c,colCount:d}),this.grid=f.grid,l=new t(this.grid,this.colCount,this.rowCount,this.winningCount)}return _createClass(a,[{key:"onIllegalMove",value:function(e){d=e}},{key:"onGameEnd",value:function(e){g=e}},{key:"onPlayerChange",value:function(e){m=e}},{key:"getGrid",value:function(){return f.grid}},{key:"getCurrentPlayer",value:function(){return c[u]}},{key:"start",value:function(){o(s[0])}},{key:"reset",value:function(){e.cancel(v),f.reset(),o(s[0])}},{key:"registerPlayer",value:function(e){e.setGame(this),c[e.id]=e,s.push(e.id)}},{key:"makeMove",value:function(e,n){return l.isValidMove(u,e,n)?(f.drop(n,e),r(e,this.moveDelay),!0):(d(c[e]),!1)}}]),a}();return p}]);var _createClass=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}();angular.module("app").factory("GameValidator",[function(){function e(e){for(var n=0;i>n;n++)for(var t=0,r=0;a>r;r++)if(o[r]&&o[r][n]===e){if(t++,t===u)return!0}else t=0;return!1}function n(e){for(var n=0;a>n;n++)for(var t=0,r=0;r<o[n].length;r++)if(o[n][r]===e){if(t++,t===u)return!0}else t=0;return!1}function t(e){for(var n,t,r,l=0;i>l;l++)for(n=0,t=l,r=0;a>n&&i>t;){if(o[n]&&o[n][t]===e){if(r++,r===u)return!0}else r=0;t++,n++}for(var s=0;a>s;s++)for(n=s,t=0,r=0;a>n&&i>t;){if(o[n]&&o[n][t]===e){if(r++,r===u)return!0}else r=0;t++,n++}return!1}function r(e){for(var n,t,r,l=0;a>l;l++)for(n=l,t=0,r=0;n>=0&&i>t;){if(o[n]&&o[n][t]===e){if(r++,r===u)return!0}else r=0;t++,n--}for(var s=0;i>s;s++)for(n=a-1,t=s,r=0;n>=0&&i>t;){if(o[n]&&o[n][t]===e){if(r++,r===u)return!0}else r=0;t++,n--}return!1}var o,a,i,u,l=function(){function l(e,n,t,r){_classCallCheck(this,l),o=e,a=n,i=t,u=r}return _createClass(l,[{key:"checkWinner",value:function(o){return e(o)||n(o)||t(o)||r(o)}},{key:"checkTie",value:function(){for(var e=!0,n=0;i>n;n++)e=e&&o[n].length>=i;return e}},{key:"isValidMove",value:function(e,n,t){var r=null!==n&&n==e,u=t>-1&&a>t,l=o[t].length<i;return r&&u&&l}}]),l}();return l}]);var _createClass=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}();angular.module("app").factory("Grid",[function(){var e=function(){function e(){var n=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],t=n.rowCount,r=void 0===t?6:t,o=n.colCount,a=void 0===o?7:o;_classCallCheck(this,e),this.rowCount=r,this.colCount=a,this.grid=[];for(var i=0;i<this.colCount;i++)this.grid.push([])}return _createClass(e,[{key:"reset",value:function(){for(var e=0;e<this.colCount;e++)this.grid[e].length=0}},{key:"drop",value:function(e,n){this.grid[e].push(n)}}]),e}();return e}]);var _createClass=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}();angular.module("app").factory("AutomatedPlayer",["$timeout","Player",function(e,n){function t(e,n){var t;do t=r(e.colCount);while(!e.makeMove(n,t))}function r(e){var n=0,t=e-1;return Math.floor(Math.random()*(t-n+1))+n}var o=function(n){function r(e){var n=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],t=n.isUser,o=void 0===t?!1:t;return _classCallCheck(this,r),_possibleConstructorReturn(this,Object.getPrototypeOf(r).call(this,e,{isUser:o,isAutomated:!0}))}return _inherits(r,n),_createClass(r,[{key:"onTurnStarted",value:function(){var n=this;e(function(){t(n.game,n.id)},500)}}]),r}(n);return o}]);var _createClass=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}();angular.module("app").factory("HumanPlayer",["Player",function(e){var n=function(e){function n(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],r=t.isUser,o=void 0===r?!1:r;return _classCallCheck(this,n),_possibleConstructorReturn(this,Object.getPrototypeOf(n).call(this,e,{isUser:o,isAutomated:!1}))}return _inherits(n,e),_createClass(n,[{key:"makeMove",value:function(e){this.game.makeMove(this.id,e)}}]),n}(e);return n}]);var _createClass=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}();angular.module("app").factory("Player",[function(){var e=function(){function e(n){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],r=t.isUser,o=void 0===r?!1:r,a=t.isAutomated,i=void 0===a?!0:a;_classCallCheck(this,e),this.id=n,this.isUser=o,this.isAutomated=i,this.game=null}return _createClass(e,[{key:"setGame",value:function(e){this.game=e}},{key:"onTurnStarted",value:function(){}},{key:"makeMove",value:function(e){}}]),e}();return e}]),angular.module("templates",[]).run(["$templateCache",function(e){e.put("game.html",'<div>\r\n    <div class="info-bar well row">\r\n        <div col="col-xs-12">\r\n            <input class="reset-button btn btn-lg" type="button" ng-click="resetGame()" value="New Game"/>\r\n            <span class="message-bar {{message.cssClass}}">\r\n                <span>{{message.text}}</span>\r\n            </span>\r\n        </div>\r\n    </div>\r\n    <div class="row">\r\n        <div col="col-xs-12">\r\n            <table id="game-grid">\r\n                <thead>\r\n                    <tr>\r\n                        <th ng-repeat="colNo in colIndices">\r\n                            <input class="drop-button" \r\n                                ng-disabled="!currentPlayer() || !currentPlayer().isUser" \r\n                                type="button" \r\n                                ng-click="currentPlayer().makeMove(colNo)" \r\n                                value="drop!" />\r\n                        </th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr ng-repeat="rowNo in rowIndices">\r\n                        <td ng-repeat="colNo in colIndices">\r\n                            <div class="disc animated bounceInDown" \r\n                                ng-if="grid()[colNo][rowNo] > 0"\r\n                                ng-class="{ \'player-1-disc\' : grid()[colNo][rowNo] === 1, \'player-2-disc\': grid()[colNo][rowNo] === 2 }">\r\n                            </div>\r\n                        </td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n        </div>\r\n    </div>\r\n</div>\r\n'),e.put("layout.html",'<div>\r\n    <nav class="navbar navbar-static-top">\r\n        <div class="container">\r\n            <div class="navbar-header">\r\n                <a class="navbar-brand" href="#">Four in a row</a>\r\n            </div>\r\n        </div>\r\n    </nav>\r\n    <div class="page-content container-fluid">\r\n        <div ui-view></div>\r\n    </div>\r\n</div>\r\n')}]);