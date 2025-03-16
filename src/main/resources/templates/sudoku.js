let originalBoard = [];
let board = [];

async function startNewGame() {
    const difficulty = document.getElementById("difficulty").value;

    const response = await fetch("/api/sudoku", {
        method: "GET", // Falls dein Backend `GET` verwendet, ändere das hier zu `GET`
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty: parseInt(difficulty) }) // Sende Schwierigkeit an Backend
    });

    board = await response.json();
    originalBoard = JSON.parse(JSON.stringify(board)); // Speichert Originalzustand für Reset
    renderBoard();
}

function renderBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // Leere das Spielfeld
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement("input");
            cell.className = "cell";
            cell.type = "text";
            cell.maxLength = 1;
            cell.value = board[row][col] === 0 ? "" : board[row][col];
            cell.disabled = originalBoard[row][col] !== 0; // Fixierte Zahlen sperren
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("input", updateBoard);
            boardElement.appendChild(cell);
        }
    }
}

function updateBoard(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    board[row][col] = event.target.value ? parseInt(event.target.value) : 0;
}

async function checkSolution() {
    const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(board)
    });

    const result = await response.json();
    document.getElementById("message").innerText = result.valid ? "Korrekt!" : "Falsch!";
}

function resetGame() {
    board = JSON.parse(JSON.stringify(originalBoard));
    renderBoard();
    document.getElementById("message").innerText = "";
}

window.onload = startNewGame; // Starte ein neues Spiel beim Laden der Seite
