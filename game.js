// Select elements
const gameCells = document.querySelectorAll(".gamecell");
const resultDialog = document.querySelector(".result-dialog");
const resultText = document.querySelector(".result-dialog h1");
const playAgainButton = document.querySelector(".play-again");
const backHomeButton = document.querySelector(".back-home");
const namesDialog = document.querySelector(".names-dialog");
const nameForm = document.querySelector(".names-dialog form");
const player1Input = document.querySelector("#name1");
const player2Input = document.querySelector("#name2");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false; // Start inactive
let player1 = "Player 1";
let player2 = "Player 2";

// Winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Show name input dialog when game starts
window.onload = function () {
    namesDialog.showModal();
};

// Handle name input
nameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    player1 = player1Input.value || "Player 1";
    player2 = player2Input.value || "Player 2";
    namesDialog.close();
    gameActive = true; // Start game after entering names
    updateTurnText();
});

// Handle cell click
function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.position;

    if (board[index] === "" && gameActive) {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        checkWinner();
        currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch player
        updateTurnText();
    }
}

// Update turn text
function updateTurnText() {
    document.querySelector("main p").textContent = 
        currentPlayer === "X" ? `${player1}'s Turn (X)` : `${player2}'s Turn (O)`;
}

// Check for winner or draw
function checkWinner() {
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            showResult(`${board[a] === "X" ? player1 : player2} Wins!`);
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
    resultDialog.showModal();
}

// Reset game
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameCells.forEach(cell => cell.textContent = "");
    currentPlayer = "X";
    gameActive = true;
    updateTurnText();
}

// Event Listeners
gameCells.forEach(cell => cell.addEventListener("click", handleCellClick));
playAgainButton.addEventListener("click", () => {
    resultDialog.close();
    resetGame();
});
backHomeButton.addEventListener("click", () => {
    window.location.href = "http://localhost:3001/"; // Change this if needed
});
