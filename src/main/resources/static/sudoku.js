let originalBoard = [];
let board = [];
let notes = Array(9).fill(null).map(() =>
    Array(9).fill(null).map(() => [])
);

let noteMode = false;

async function startNewGame() {
    const difficulty = document.getElementById("difficulty").value;

    const response = await fetch(`/api/sudoku?difficulty=${difficulty}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    board = await response.json();
    originalBoard = JSON.parse(JSON.stringify(board));
    notes = Array(9).fill(null).map(() =>
        Array(9).fill(null).map(() => [])
    );

    renderBoard();
}

function renderBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    const table = document.createElement("table");
    table.className = "sudoku-board";

    for (let row = 0; row < 9; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < 9; col++) {
            const td = document.createElement("td");
            td.classList.add("cell-container");

            const cell = document.createElement("input");
            cell.className = "cell";
            cell.type = "text";
            cell.maxLength = 1;
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.disabled = originalBoard[row][col] !== 0;

            if (board[row][col] === 0 && notes[row][col].length > 0) {
                cell.classList.add("notes-cell");
                cell.value = "";
                cell.placeholder = notes[row][col].sort().join("");
            } else {
                cell.value = board[row][col] === 0 ? "" : board[row][col];
                cell.placeholder = "";
            }

            cell.addEventListener("input", handleInput);
            cell.addEventListener("mouseenter", highlightSameNumbers);
            cell.addEventListener("mouseleave", clearHighlights);
            cell.addEventListener("focus", highlightSameNumbers);
            cell.addEventListener("blur", clearHighlights);

            td.appendChild(cell);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    boardElement.appendChild(table);
}

async function handleInput(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const val = event.target.value;

    if (noteMode) {
        event.target.value = ""; // Notizen erscheinen als placeholder
        const num = parseInt(val);
        if (isNaN(num) || num < 1 || num > 9) return;

        const idx = notes[row][col].indexOf(num);
        if (idx === -1) {
            notes[row][col].push(num);
        } else {
            notes[row][col].splice(idx, 1);
        }
    } else {
        const num = parseInt(val);
        board[row][col] = isNaN(num) ? 0 : num;
        notes[row][col] = [];
    }

    renderBoard();

    if (isBoardFull()) {
        await checkSolution();
    }
}

function resetGame() {
    board = JSON.parse(JSON.stringify(originalBoard));
    notes = Array(9).fill(null).map(() =>
        Array(9).fill(null).map(() => [])
    );

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
            cell.style.backgroundColor = "lightcoral";
        }
    });
}

function resetCellColors() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.style.backgroundColor = "white";
    });
}

function isValidMove(row, col, num) {
    if (num === 0) return true;

    for (let i = 0; i < 9; i++) {
        if (i !== col && board[row][i] === num) return false;
        if (i !== row && board[i][col] === num) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (startRow + i !== row && startCol + j !== col && board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

function highlightSameNumbers(event) {
    const value = event.target.value;
    if (!value) return;

    document.querySelectorAll(".cell").forEach(cell => {
        if (cell.value === value) {
            cell.classList.add("same-number");
        }
    });
}

function clearHighlights() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.classList.remove("same-number");
    });
}

function toggleNoteMode() {
    noteMode = !noteMode;
    const btn = document.getElementById("noteToggle");
    btn.innerText = noteMode ? "✏️ Notizmodus: AN" : "✏️ Notizmodus: AUS";
}

function isBoardFull() {
    return board.every(row => row.every(num => num >= 1 && num <= 9));
}


window.onload = async () => {
    await startNewGame();
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "noteToggle";
    toggleBtn.innerText = "✏️ Notizmodus: AUS";
    toggleBtn.addEventListener("click", toggleNoteMode);
    document.getElementById("controls").appendChild(toggleBtn);
};

