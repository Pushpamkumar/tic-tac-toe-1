const gameCells = document.querySelectorAll('.gamecell');
const resetButton = document.querySelector('main button');
const namesDialog = document.querySelector('.names-dialog');
const namesDialogButton = namesDialog.querySelector('button');

const Player = (name, symbol) => ({
    getSymbol: () => symbol,
    getName: () => name,
});

// Initialize Players
namesDialog.showModal();
namesDialogButton.addEventListener('click', (event) => {
    const form = namesDialog.querySelector('form');
    const player1Name = form.querySelector('#name1').value;
    const player2Name = form.querySelector('#name2').value;
    if (form.checkValidity()) {
        event.preventDefault();
        namesDialog.close();
        gameInitialization(Player(player1Name, 'X'), Player(player2Name, 'O'));
    }
});

// Game Initialization
function gameInitialization(player1, player2) {
    const gameBoard = (() => {
        let gameBoardArray = Array(9).fill(null);

        const addToArray = (symbol, position) => gameBoardArray[position] = symbol;
        const clearArray = () => gameBoardArray.fill(null);
        const getRows = () => [gameBoardArray.slice(0, 3), gameBoardArray.slice(3, 6), gameBoardArray.slice(6)];
        const getColumns = () => [0, 1, 2].map(i => [gameBoardArray[i], gameBoardArray[i+3], gameBoardArray[i+6]]);
        const getDiagonals = () => [[gameBoardArray[0], gameBoardArray[4], gameBoardArray[8]], [gameBoardArray[2], gameBoardArray[4], gameBoardArray[6]]];
        
        const checkWinner = () => {
            for (let line of [...getRows(), ...getColumns(), ...getDiagonals()]) {
                if (line.every(cell => cell && cell === line[0])) return { winner: line[0] };
            }
            return { tie: !gameBoardArray.includes(null) };
        };
        
        return { addToArray, clearArray, checkWinner };
    })();

    const displayController = (() => {
        const playerTurnTitle = document.querySelector('main p');
        const winnerDialog = document.querySelector('.result-dialog');
        const winnerDialogMessage = winnerDialog.querySelector('h1');

        winnerDialog.addEventListener('click', (event) => { if (event.target === winnerDialog) winnerDialog.close(); });
        const updateCell = (cell, symbol) => cell.textContent = symbol;
        const updateTitle = (message) => playerTurnTitle.textContent = message;
        const showResult = (message) => { winnerDialogMessage.textContent = message; winnerDialog.showModal(); };
        const clearBoard = () => gameCells.forEach(cell => cell.textContent = '');
        
        return { updateCell, updateTitle, showResult, clearBoard };
    })();

    const game = (() => {
        let currentPlayer = player1;
        let gameEnded = false;

        displayController.updateTitle(`${currentPlayer.getName()}'s Turn`);

        const handleMove = (cell) => {
            if (cell.textContent || gameEnded) return;
            displayController.updateCell(cell, currentPlayer.getSymbol());
            gameBoard.addToArray(currentPlayer.getSymbol(), cell.dataset.position);
            
            const result = gameBoard.checkWinner();
            if (result.winner) {
                displayController.showResult(`${currentPlayer.getName()} Wins!`);
                gameEnded = true;
            } else if (result.tie) {
                displayController.showResult("It's a Tie");
                gameEnded = true;
            } else {
                currentPlayer = currentPlayer === player1 ? player2 : player1;
                displayController.updateTitle(`${currentPlayer.getName()}'s Turn`);
            }
        };

        const resetGame = () => {
            displayController.clearBoard();
            gameBoard.clearArray();
            gameEnded = false;
            currentPlayer = player1;
            displayController.updateTitle(`${currentPlayer.getName()}'s Turn`);
        };

        return { handleMove, resetGame };
    })();

    resetButton.addEventListener('click', game.resetGame);
    gameCells.forEach(cell => cell.addEventListener('click', (e) => game.handleMove(e.target)));
}
