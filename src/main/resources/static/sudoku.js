let originalBoard = [];
let board = [];

async function startNewGame() {
    const difficulty = document.getElementById("difficulty").value;

    const response = await fetch(`/api/sudoku?difficulty=${difficulty}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });


    board = await response.json();
    originalBoard = JSON.parse(JSON.stringify(board)); // Speichert Originalzustand für Reset
    renderBoard();
}

function renderBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // Leere das Spielfeld

    const table = document.createElement("table");
    table.className = "sudoku-board";

    for (let row = 0; row < 9; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < 9; col++) {
            const td = document.createElement("td");
            const cell = document.createElement("input");

            cell.className = "cell";
            cell.type = "text";
            cell.maxLength = 1;
            cell.value = board[row][col] === 0 ? "" : board[row][col];
            cell.disabled = originalBoard[row][col] !== 0;
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("input", updateBoard);

            td.appendChild(cell);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    boardElement.appendChild(table);
}


function updateBoard(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    board[row][col] = event.target.value ? parseInt(event.target.value) : 0;
}

function resetGame() {
    board = JSON.parse(JSON.stringify(originalBoard));
    renderBoard();
    document.getElementById("message").innerText = "";
}

async function checkSolution() {
    const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(board)
    });

    const result = await response.json();
    const messageElement = document.getElementById("message");

    if (result.valid) {
        messageElement.innerText = "✅ Sudoku ist korrekt!";
        messageElement.style.color = "green";
        resetCellColors();
    } else {
        messageElement.innerText = "❌ Fehler im Sudoku!";
        messageElement.style.color = "red";
        highlightErrors();
    }
}

function highlightErrors() {
    document.querySelectorAll(".cell").forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (!isValidMove(row, col, board[row][col])) {
            cell.style.backgroundColor = "lightcoral"; // Fehlerhafte Zellen rot markieren
        }
    });
}

function resetCellColors() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.style.backgroundColor = "white";
    });
}

// Lokale Validierung für die Eingaben im Browser (optional)
function isValidMove(row, col, num) {
    if (num === 0) return true;

    for (let i = 0; i < 9; i++) {
        if (i !== col && board[row][i] === num) return false; // Prüfe Zeile
        if (i !== row && board[i][col] === num) return false; // Prüfe Spalte
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (startRow + i !== row && startCol + j !== col && board[startRow + i][startCol + j] === num) {
                return false; // Prüfe 3×3 Block
            }
        }
    }
    return true;
}


window.onload = startNewGame; // Starte ein neues Spiel beim Laden der Seite
