const gameCells = document.querySelectorAll('.gamecell');
const resetButton = document.querySelector('main button');
const namesDialog = document.querySelector('.names-dialog');
const namesDialogButton = namesDialog.querySelector('button');

const Player = (name, symbol) => ({ getSymbol: () => symbol, getName: () => name });

// Initialize Players
namesDialog.showModal();
namesDialogButton.addEventListener('click', (event) => {
    const form = namesDialog.querySelector('form');
    if (form.checkValidity()) {
        event.preventDefault(); // Prevent default form submission
        const player1 = Player(form.querySelector('#name1').value, 'X');
        const player2 = Player(form.querySelector('#name2').value, 'O');
        namesDialog.close();
        gameInitialization(player1, player2);
    }
});

function gameInitialization(player1, player2) {
    const gameBoard = (() => {
        let board = Array(9).fill(null);

        return {
            addToBoard: (symbol, position) => board[position] = symbol,
            clearBoard: () => board.fill(null),
            getRows: () => [board.slice(0, 3), board.slice(3, 6), board.slice(6, 9)],
            getColumns: () => [[board[0], board[3], board[6]], [board[1], board[4], board[7]], [board[2], board[5], board[8]]],
            getDiagonals: () => [[board[0], board[4], board[8]], [board[2], board[4], board[6]]],
            checkWinner: () => {
                const lines = [...gameBoard.getRows(), ...gameBoard.getColumns(), ...gameBoard.getDiagonals()];
                for (const line of lines) {
                    if (line.every(cell => cell && cell === line[0])) return { winner: true, symbol: line[0] };
                }
                return { winner: false, tie: board.every(cell => cell !== null) };
            }
        };
    })();

    const displayController = (() => {
        const playerTurnTitle = document.querySelector('main p');
        const resultDialog = document.querySelector('.result-dialog');
        const resultMessage = resultDialog.querySelector('h1');
        
        resultDialog.addEventListener('click', (e) => { if (e.target === resultDialog) resultDialog.close(); });

        return {
            updateCell: (cell, symbol) => cell.textContent = symbol,
            updateTurnTitle: (message) => playerTurnTitle.textContent = message,
            showResult: (message) => { resultMessage.textContent = message; resultDialog.showModal(); },
            clearBoard: () => gameCells.forEach(cell => cell.textContent = '')
        };
    })();

    const game = (() => {
        let currentPlayer = player1;
        let gameOver = false;
        displayController.updateTurnTitle(`${currentPlayer.getName()}'s Turn`);

        function handleMove(cell) {
            if (gameOver || cell.textContent !== '') return;
            displayController.updateCell(cell, currentPlayer.getSymbol());
            gameBoard.addToBoard(currentPlayer.getSymbol(), cell.dataset.position);
            
            const result = gameBoard.checkWinner();
            if (result.winner) {
                displayController.showResult(`${currentPlayer.getName()} Wins!`);
                gameOver = true;
            } else if (result.tie) {
                displayController.showResult("It's a Tie");
                gameOver = true;
            } else {
                currentPlayer = currentPlayer === player1 ? player2 : player1;
                displayController.updateTurnTitle(`${currentPlayer.getName()}'s Turn`);
            }
        }

        function resetGame() {
            gameOver = false;
            gameBoard.clearBoard();
            displayController.clearBoard();
            currentPlayer = player1;
            displayController.updateTurnTitle(`${currentPlayer.getName()}'s Turn`);
        }

        return { handleMove, resetGame };
    })();

    resetButton.addEventListener('click', game.resetGame);
    gameCells.forEach(cell => cell.addEventListener('click', (e) => game.handleMove(e.target)));
}
