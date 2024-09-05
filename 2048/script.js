const boardSize = 4;
let board = [];
let score = 0;
let isGameOver = false;

const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');

// Initialize the game board
function initBoard() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    score = 0;
    isGameOver = false;
    addNewTile();
    addNewTile();
    drawBoard();
    gameOverMessage.style.display = 'none';
}

// Draw the game board on the screen
function drawBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[i][j] !== 0) {
                cell.textContent = board[i][j];
                cell.style.backgroundColor = getTileColor(board[i][j]);
                cell.style.color = getTextColor(board[i][j]);
            } else {
                cell.textContent = '';
                cell.style.backgroundColor = '#cdc1b4';
            }
            gameBoard.appendChild(cell);
        }
    }
    scoreDisplay.textContent = score;
}

// Add a new tile (either 2 or 4) to the board
function addNewTile() {
    let emptyCells = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ x: i, y: j });
            }
        }
    }

    if (emptyCells.length === 0) return;

    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[x][y] = Math.random() < 0.9 ? 2 : 4;
}

// Return the color of the tile based on its value
function getTileColor(value) {
    switch (value) {
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#3c3a32';
    }
}

// Return the text color based on tile value
function getTextColor(value) {
    return value > 4 ? '#fff' : '#000'; // White text for larger numbers, black for smaller ones
}

// Compress the row/column by shifting numbers to the left
function compress(row) {
    let newRow = row.filter(val => val !== 0);
    while (newRow.length < boardSize) {
        newRow.push(0);
    }
    return newRow;
}

// Merge adjacent equal numbers
function merge(row) {
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    return row;
}

// Helper function to check if two arrays are equal
function arraysEqual(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}

// Move functions (combine tiles and shift them)
function moveLeft() {
    let moved = false;
    for (let i = 0; i < boardSize; i++) {
        let row = board[i];
        let originalRow = [...row];
        row = compress(row);
        row = merge(row);
        row = compress(row);
        board[i] = row;
        if (!arraysEqual(originalRow, row)) {
            moved = true;
        }
    }
    if (moved) {
        addNewTile();
        drawBoard();
        checkGameOver();
    }
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < boardSize; i++) {
        let row = board[i].slice().reverse();
        let originalRow = [...row];
        row = compress(row);
        row = merge(row);
        row = compress(row);
        board[i] = row.reverse();
        if (!arraysEqual(originalRow, row)) {
            moved = true;
        }
    }
    if (moved) {
        addNewTile();
        drawBoard();
        checkGameOver();
    }
}

function moveUp() {
    let moved = false;
    for (let j = 0; j < boardSize; j++) {
        let column = [];
        for (let i = 0; i < boardSize; i++) {
            column.push(board[i][j]);
        }
        let originalColumn = [...column];
        column = compress(column);
        column = merge(column);
        column = compress(column);
        for (let i = 0; i < boardSize; i++) {
            board[i][j] = column[i];
        }
        if (!arraysEqual(originalColumn, column)) {
            moved = true;
        }
    }
    if (moved) {
        addNewTile();
        drawBoard();
        checkGameOver();
    }
}

function moveDown() {
    let moved = false;
    for (let j = 0; j < boardSize; j++) {
        let column = [];
        for (let i = 0; i < boardSize; i++) {
            column.push(board[i][j]);
        }
        column = column.reverse();
        let originalColumn = [...column];
        column = compress(column);
        column = merge(column);
        column = compress(column);
        column = column.reverse();
        for (let i = 0; i < boardSize; i++) {
            board[i][j] = column[i];
        }
        if (!arraysEqual(originalColumn, column)) {
            moved = true;
        }
    }
    if (moved) {
        addNewTile();
        drawBoard();
        checkGameOver();
    }
}

// Check if the game is
// Check if the game is over
function checkGameOver() {
    let isOver = true;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === 0 ||
                (j < boardSize - 1 && board[i][j] === board[i][j + 1]) ||
                (i < boardSize - 1 && board[i][j] === board[i + 1][j])) {
                isOver = false;
                break;
            }
        }
    }
    if (isOver) {
        isGameOver = true;
        gameOverMessage.style.display = 'block';
    }
}

// Event listeners for control buttons
window.onload = function() {
    // Add click events for mobile
    document.getElementById('up-button').addEventListener('click', () => {
        if (!isGameOver) moveUp();
    });

    document.getElementById('down-button').addEventListener('click', () => {
        if (!isGameOver) moveDown();
    });

    document.getElementById('left-button').addEventListener('click', () => {
        if (!isGameOver) moveLeft();
    });

    document.getElementById('right-button').addEventListener('click', () => {
        if (!isGameOver) moveRight();
    });

    document.getElementById('restart-button').addEventListener('click', () => {
        initBoard();
    });

    // Initialize the game
    initBoard();

    // Add keydown events for desktop
    window.addEventListener('keydown', (e) => {
        if (isGameOver) return;
        switch (e.key) {
            case 'ArrowUp':
                moveUp();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
        }
    });
};
