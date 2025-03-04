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

    // Create a container for buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.marginTop = "15px";

    // Create buttons dynamically
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = "Play Again";
    playAgainButton.style.padding = "10px 20px";
    playAgainButton.style.cursor = "pointer";
    playAgainButton.style.backgroundColor = "#28a745";
    playAgainButton.style.color = "white";
    playAgainButton.style.border = "none";
    playAgainButton.style.borderRadius = "5px";

    const homeButton = document.createElement('button');
    homeButton.textContent = "Back to Home";
    homeButton.style.padding = "10px 20px";
    homeButton.style.cursor = "pointer";
    homeButton.style.backgroundColor = "#007bff";
    homeButton.style.color = "white";
    homeButton.style.border = "none";
    homeButton.style.borderRadius = "5px";

    // Add event listeners
    playAgainButton.addEventListener('click', () => {
        game.cleanGame();
        winnerDialog.close();
    });

    homeButton.addEventListener('click', () => {
        window.location.href = "index.html"; // Change to your home page URL
    });

    // Append buttons inside the container
    buttonContainer.appendChild(playAgainButton);
    buttonContainer.appendChild(homeButton);

    // Append container to the winner dialog
    winnerDialog.appendChild(buttonContainer);

    // Close dialog when clicking outside
    winnerDialog.addEventListener('click', (event) => {
        if (event.target === winnerDialog) {
            winnerDialog.close();
        }
    });

    const addPlayerSymbol = (target, symbol) => {
        target.textContent = symbol;
    }

    const changePlayerTurnTitle = (message) => {
        playerTurnTitle.textContent = message;
    }

    const showResultDialog = (message) => {
        winnerDialogMessage.textContent = message;
        winnerDialog.showModal();
    }

    const cleanGameboard = () => {
        gameCells.forEach(cell => { cell.textContent = '' });
    }

    return { addPlayerSymbol, changePlayerTurnTitle, showResultDialog, cleanGameboard };
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
