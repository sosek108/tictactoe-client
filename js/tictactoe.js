$(document).ready(function() {
	board = $('#board');
	msg = $('#message');
	game = ticTacToe(board, msg);
	game.init();
});

var ticTacToe = function (board, msg) {
	
	return {
		turn: 'o',											//o is first
		board: ['-','-','-','-','-','-','-','-','-'],		//board is empty at the begining
		status: -1,											//-1 unresolved, 0 draw, 1 win
		winSchema: [],
		boardBox: board,
		msgBox: msg,
		init: function() {
			pthis = this;									//preserve this of object to callback
			$(this.boardBox).children('.tile').each(function() {
				$(this).click(function(){
					return pthis.click(this);
				});
			});
		},
		changeTurn: function() {
			this.turn = this.turn == 'o' ? 'x' : 'o';
			this.msgBox.text(this.turn + '\'s turn')
		},
		check: function(id) {
			b = this.board
			//columns
			cID = id % 3;
			col = [cID, cID+3, cID+6];
			if (b[col[0]] == b[col[1]] && b[col[1]] == b[col[2]]) {
				this.status = 1;
				this.winSchema = col;
			}
			//rows
			rID = Math.floor(id/3);
			row = [rID*3, rID*3+1, rID*3+2];

			if (b[row[0]] == b[row[1]] && b[row[1]] == b[row[2]]) {
				this.status = 1;
				this.winSchema = row;
			}
			//rows


			//diagonals
			diag = [[0,4,8],[2,4,6]];
			checkDiag = [false, false];

			if (id % 4 == 0) checkDiag[0] = true
			if ((id % 2 == 0) && id != 8 && id != 0) checkDiag[1] = true;

			if (checkDiag[0] && (b[diag[0][0]] == b[diag[0][1]] && b[diag[0][1]] == b[diag[0][2]])) {
				this.status = 1;
				this.winSchema = diag[0];
			}

			if (checkDiag[1] && (b[diag[1][0]] == b[diag[1][1]] && b[diag[1][1]] == b[diag[1][2]])) {
				this.status = 1;
				this.winSchema = diag[1];
			}

			if (b.indexOf('-') == -1)
				this.status = 0;
		},
		click: function(tile) {
			if ($(tile).hasClass('used') || this.status >= 0) {					//if clicked then nothing
				return;
			}

			$(tile).addClass(this.turn + ' used');				//add classes 
			id = $(tile).data('id')
			this.board[ id ] = this.turn;					//set board
			
			this.check(id);

			if (this.status == -1)							//change turn only if no status
				this.changeTurn();
			else if (this.status == 0)
				this.msgBox.text('draw!');
			else {
				from = $(this.boardBox).children('.tile[data-id='+this.winSchema[0]+']');
				to = $(this.boardBox).children('.tile[data-id='+this.winSchema[2]+']')
				this.msgBox.text(this.turn + '\'s won!');
				this.drawLine(from, to);
			}
			return this.status;
		},
		drawLine: function(from, to) {
			line = $('#line');
			line.css('zIndex', 2);				//move svg layer to top from -1
			
			fromPos = from.position();
			fromPos.top += from.height()/2;
			fromPos.left += from.width()/2;
			toPos = to.position();
			console.log(toPos);
			toPos.top += to.height()/2;
			toPos.left += to.width()/2;

			path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			path.setAttribute('d', 'M'+fromPos.left+' '+fromPos.top+' '+toPos.left+' '+toPos.top);
			path.setAttribute('id', 'line-path');
			length = Math.ceil(path.getTotalLength());
			path.setAttribute('stroke-dasharray', length);
			path.setAttribute('stroke-dashoffset', length);
			line.append(path);
		}
	}
}