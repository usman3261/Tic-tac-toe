

const DOM = (() => {
	return {
		
		selection: document.querySelectorAll('.selection'),
	
		makeActive: function (e) {
			e.target.parentNode.querySelectorAll('.selection').forEach((child) => {
				child.classList.remove('active');
			});
			e.target.classList.add('active');
			if (e.target.classList.contains('human')) {
				if (e.target.classList.contains('one')) {
					Controller.player1.type = 'human';
				} else {
					Controller.player2.type = 'human';
				}
			} else if (e.target.classList.contains('one')) {
				Controller.player1.type = 'ai';
			} else {
				Controller.player2.type = 'ai';
			}
		},

		boardContainer: document.querySelector('.gameboard'),
		
		getSquares: function () {
			return this.boardContainer.querySelectorAll('.square');
		},

		newSquare: function (html) {
			const square = document.createElement('div');
			square.className = 'square';
			square.innerHTML = html;
			return square;
		},

		newSquareInner: function (mark) {
			return `<span>${mark}</span>`;
		},

		clearBoard: function () {
			DOM.getSquares().forEach((square) => {
				this.boardContainer.removeChild(square);
			});
		},

		render: function (board) {
			this.clearBoard();
			board.forEach((square) => {
				this.boardContainer.appendChild(
					DOM.newSquare(DOM.newSquareInner(square.mark))
				);
			});
		},

		setupWindow: document.querySelector('.setup'),
		startButton: document.querySelector('.startgame'),
		turnIndicator: document.querySelector('.turn'),
		winnerBanner: document.querySelector('.winner'),

		winDisplay: function (winner) {
			if (winner) {
				this.winnerBanner.textContent = `${winner} wins!`;
			} else {
				this.winnerBanner.textContent = "It's a tie!";
			}
			const playAgainContainer = document.createElement('div');
			playAgainContainer.className = 'playagaincontainer';
			const playAgain = document.createElement('button');
			playAgain.textContent = 'Play Again';
			playAgain.className = 'playagain';
			playAgainContainer.appendChild(playAgain);
			this.winnerBanner.appendChild(playAgainContainer);
			playAgain.addEventListener('click', () => {
				location.reload();
				return false;
			});
		},
	};
})();

const Gameboard = (() => {
	
	const square = {
		mark: '',
	};
	
	const board = [];
	
	const getBoard = () => {
		return board;
	};
	
	const newMarker = (mark, index) => {
		board[index] = { mark };
		DOM.render(board);
	};

	
	const init = () => {
		for (let count = 1; count <= 9; count++) {
			board.push(square);
		}
		DOM.render(getBoard());
	};

	return {
		getBoard,
		init,
		newMarker,
	};
})();

const Controller = (() => {
	
	const player1 = {
		name: 'Player 1',
		marker: 'X',
		type: '',
	};

	const player2 = {
		name: 'Player 2',
		marker: 'O',
		type: '',
	};
	
	let player1turn = true;
	
	const init = () => {
		DOM.selection.forEach((element) => {
			element.addEventListener('click', DOM.makeActive);
		}),
			DOM.startButton.addEventListener('click', () => {
				if (selectionCheck()) {
					startGame();
				} else {
					alert('Please select a player type for each player');
				}
			});
	};
	
	playerToggle = () => {
		player1turn = !player1turn;
	};
	
	const selectionCheck = () => {
		return Boolean(player1.type && player2.type);
	};

	const startGame = () => {
		DOM.setupWindow.style.display = 'none';
		Gameboard.init();
		takeTurn();
	};


	const checkWinner = () => {
		const board = Gameboard.getBoard();
		const winConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		
		if (
			winConditions.some((array) => {
				let winCheck = [];
				array.forEach((box) => {
					if (board[box].mark !== '') {
						winCheck.push(board[box]);
					}
				});
				if (winCheck.length == 3) {
					if (
						winCheck.every((square) => {
							return square.mark == 'X';
						})
					) {
						DOM.winDisplay(player1.name);
						return true;
					} else if (
						winCheck.every((square) => {
							return square.mark == 'O';
						})
					) {
						DOM.winDisplay(player2.name);
						return true;
					} else {
						return false;
					}
				}
			})
		) {
			return true;
		
		} else if (
			board.filter((square) => {
				return square.mark !== '';
			}).length == 9
		) {
			DOM.winDisplay();
			return true;
		} else return false;
	};

	const computerPlay = (marker) => {
		let choices = Gameboard.getBoard().map((square, index) => {
			if (square.mark !== '') {
				return false;
			} else {
				return index;
			}
		});
		choices = choices.filter((item) => {
			return item !== false;
		});
		const selection = Math.floor(Math.random() * choices.length);
		Gameboard.newMarker(marker, choices[selection]);
		playerToggle();
		takeTurn();
	};

	const humanPlay = (marker) => {
		DOM.getSquares().forEach((square) => {
			square.addEventListener('click', (e) => {
				if (e.currentTarget.textContent == '') {
					const index = Array.from(e.currentTarget.parentNode.children).indexOf(
						e.currentTarget
					);
					Gameboard.newMarker(marker, index);
					playerToggle();
					takeTurn();
					return;
				}
			});
		});
	};
	
	const takeTurn = () => {
		if (!checkWinner()) {
			let player;
			if (player1turn) {
				player = player1;
			} else {
				player = player2;
			}
			DOM.turnIndicator.textContent = `${player.name}'s turn:`;
			if (player.type == 'ai') {
				computerPlay(player.marker);
			} else {
				humanPlay(player.marker);
			}
		} else console.log('Winner found, stopping game');
	};
	
	init();

	return {
		player1,
		player2,
	};
})();