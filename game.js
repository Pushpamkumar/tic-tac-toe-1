// Select elements
const gameCells = document.querySelectorAll(".gamecell");
const resetButton = document.querySelector(".reset-btn");
const resultDialog = document.querySelector(".result-dialog");
const resultText = document.querySelector(".result-dialog h1");
const playAgainButton = document.querySelector(".play-again");
const backHomeButton = document.querySelector(".back-home");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Handle cell click
function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.position;

    if (board[index] === "" && gameActive) {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        checkWinner();
        currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch player
    }
}

// Check for winner or draw
function checkWinner() {
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            showResult(`${board[a]} Wins!`);
            return;
        }
    }

    if (!board.includes("")) {
        gameActive = false;
        showResult("It's a Draw!");
    }
}

// Show result dialog
function showResult(message) {
    resultText.textContent = message;
    resultDialog.showModal(); // Show result dialog
}

// Reset game
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameCells.forEach(cell => cell.textContent = "");
    currentPlayer = "X";
    gameActive = true;
}

// Event Listeners
gameCells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", () => {
    resultDialog.close();
    resetGame();
});
backHomeButton.addEventListener("click", () => {
    window.location.href = "http://localhost:3001/"; // Change to your homepage URL
});
